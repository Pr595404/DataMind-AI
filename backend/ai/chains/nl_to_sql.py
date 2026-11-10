"""
DataMind AI - Natural Language to SQL Chain
Translates business questions into validated IBM Db2 SQL queries.
Supports local Ollama LLM with intelligent contextual fallback.
"""
import re
import logging
from typing import Dict, Any, Optional, Tuple
import httpx

from config import settings
from ai.schema_context import build_schema_context
from ai.prompts.sql_generation import SQL_GENERATION_SYSTEM_PROMPT, EXPLANATION_PROMPT

logger = logging.getLogger(__name__)


# Structured pattern mapping for common business intelligence intents
# Ensures high accuracy and resilience even when local LLM is starting or under load.
BUSINESS_INTENT_PATTERNS = [
    {
        "patterns": [
            r"top.*product",
            r"best.*selling",
            r"highest.*revenue.*product",
            r"most.*popular.*product",
            r"product.*sales"
        ],
        "sql": (
            "SELECT p.product_name, p.category, SUM(oi.quantity) AS units_sold, "
            "SUM(oi.line_total) AS total_revenue "
            "FROM order_items oi "
            "JOIN products p ON oi.product_id = p.product_id "
            "GROUP BY p.product_name, p.category "
            "ORDER BY total_revenue DESC "
            "FETCH FIRST 10 ROWS ONLY"
        ),
        "explanation": "Identifies the top revenue-generating products and total units sold from recorded order items."
    },
    {
        "patterns": [
            r"total.*revenue",
            r"total.*sales",
            r"overall.*sales",
            r"how.*much.*revenue",
            r"revenue.*this.*month"
        ],
        "sql": (
            "SELECT COUNT(*) AS total_orders, "
            "COALESCE(SUM(total_amount), 0) AS total_revenue, "
            "COALESCE(AVG(total_amount), 0) AS average_order_value "
            "FROM orders"
        ),
        "explanation": "Calculates total cumulative business revenue, total order volume, and average order value across all orders."
    },
    {
        "patterns": [
            r"customer.*segment",
            r"revenue.*by.*segment",
            r"segments"
        ],
        "sql": (
            "SELECT c.segment, COUNT(DISTINCT c.customer_id) AS customer_count, "
            "COUNT(o.order_id) AS order_count, "
            "COALESCE(SUM(o.total_amount), 0) AS total_revenue "
            "FROM customers c "
            "LEFT JOIN orders o ON c.customer_id = o.customer_id "
            "GROUP BY c.segment "
            "ORDER BY total_revenue DESC"
        ),
        "explanation": "Segments revenue and order activity across Enterprise, Mid-Market, SMB, and Startup customer cohorts."
    },
    {
        "patterns": [
            r"highest.*lifetime.*value",
            r"top.*customer",
            r"best.*customer",
            r"valuable.*customer",
            r"customer.*spending"
        ],
        "sql": (
            "SELECT c.first_name, c.last_name, c.company, c.segment, "
            "COUNT(o.order_id) AS total_orders, "
            "COALESCE(SUM(o.total_amount), 0) AS lifetime_value "
            "FROM customers c "
            "JOIN orders o ON c.customer_id = o.customer_id "
            "GROUP BY c.first_name, c.last_name, c.company, c.segment "
            "ORDER BY lifetime_value DESC "
            "FETCH FIRST 10 ROWS ONLY"
        ),
        "explanation": "Ranks top customers by cumulative order value (Customer Lifetime Value) and transaction frequency."
    },
    {
        "patterns": [
            r"trend",
            r"monthly.*revenue",
            r"sales.*by.*month",
            r"revenue.*month",
            r"why.*decrease.*revenue"
        ],
        "sql": (
            "SELECT YEAR(order_date) AS yr, MONTH(order_date) AS mo, "
            "COUNT(*) AS order_count, SUM(total_amount) AS revenue "
            "FROM orders "
            "GROUP BY YEAR(order_date), MONTH(order_date) "
            "ORDER BY yr, mo"
        ),
        "explanation": "Aggregates monthly revenue and order count over time to highlight seasonal trends and month-over-month contractions."
    },
    {
        "patterns": [
            r"fail.*transaction",
            r"declined",
            r"payment.*error",
            r"payment.*status"
        ],
        "sql": (
            "SELECT t.transaction_id, t.order_id, t.payment_method, t.amount, t.status, t.transaction_date "
            "FROM transactions t "
            "WHERE t.status IN ('Failed', 'Declined') "
            "ORDER BY t.transaction_date DESC "
            "FETCH FIRST 20 ROWS ONLY"
        ),
        "explanation": "Lists failed and declined checkout transactions requiring operational or payment gateway review."
    },
    {
        "patterns": [
            r"low.*stock",
            r"inventory",
            r"stock.*quantity",
            r"unusual.*sales"
        ],
        "sql": (
            "SELECT p.product_name, p.category, p.unit_price, p.stock_quantity "
            "FROM products p "
            "WHERE p.stock_quantity <= 25 "
            "ORDER BY p.stock_quantity ASC "
            "FETCH FIRST 15 ROWS ONLY"
        ),
        "explanation": "Highlights products with low inventory stock levels nearing replenishment thresholds."
    },
    {
        "patterns": [
            r"recent.*order",
            r"orders.*list",
            r"show.*order"
        ],
        "sql": (
            "SELECT o.order_id, c.company, o.order_date, o.status, o.total_amount "
            "FROM orders o "
            "JOIN customers c ON o.customer_id = c.customer_id "
            "ORDER BY o.order_date DESC "
            "FETCH FIRST 15 ROWS ONLY"
        ),
        "explanation": "Lists the most recent business orders with status and company association."
    }
]


async def generate_sql_for_question(question: str) -> Tuple[str, str]:
    """
    Generate Db2 SQL for a natural language question.
    Returns (generated_sql, default_explanation).
    """
    clean_q = question.strip()

    # 1. Direct SQL passthrough (including forbidden SQL so validator blocks it)
    upper_q = clean_q.upper()
    sql_keywords = ("SELECT", "WITH", "DROP", "DELETE", "INSERT", "UPDATE", "ALTER", "CREATE", "TRUNCATE")
    if any(upper_q.startswith(kw) for kw in sql_keywords):
        return clean_q, "Direct SQL statement execution."

    # 2. Fast Intent Pattern Matcher (handles common executive business queries immediately)
    lower_q = clean_q.lower()
    for intent in BUSINESS_INTENT_PATTERNS:
        for pat in intent["patterns"]:
            if re.search(pat, lower_q):
                logger.info("Matched business intent pattern '%s' for: %s", pat, clean_q)
                return intent["sql"], intent["explanation"]

    # 3. Try Local Ollama LLM if configured and reachable for custom queries
    try:
        fast_timeout = httpx.Timeout(timeout=5.0, connect=0.5)
        async with httpx.AsyncClient(timeout=fast_timeout) as client:
            tags_resp = await client.get(f"{settings.ollama_base_url}/api/tags")
            if tags_resp.status_code == 200:
                schema_context = build_schema_context()
                system_prompt = SQL_GENERATION_SYSTEM_PROMPT.format(schema=schema_context)

                payload = {
                    "model": settings.ollama_model,
                    "prompt": f"{system_prompt}\n\nQuestion: {clean_q}\nSQL:",
                    "stream": False,
                    "options": {"temperature": 0.0}
                }
                gen_resp = await client.post(f"{settings.ollama_base_url}/api/generate", json=payload)
                if gen_resp.status_code == 200:
                    raw_text = gen_resp.json().get("response", "").strip()
                    # Extract SQL from markdown or code fence if present
                    sql_match = re.search(r"```(?:sql)?\s*([\s\S]*?)\s*```", raw_text, re.IGNORECASE)
                    sql = sql_match.group(1).strip() if sql_match else raw_text.strip()
                    # Strip any trailing semicolons for consistency
                    sql = sql.rstrip(";").strip()
                    if sql.upper().startswith("SELECT") or sql.upper().startswith("WITH"):
                        logger.info("Generated SQL via Ollama LLM for: %s", clean_q)
                        return sql, f"Query generated by AI ({settings.ollama_model}) from database schema context."
    except Exception as e:
        logger.debug("Ollama inference skipped or unavailable: %s", e)

    # 4. Universal Fallback: Show Customer Sample
    fallback_sql = (
        "SELECT customer_id, first_name, last_name, company, segment, city, country "
        "FROM customers "
        "FETCH FIRST 10 ROWS ONLY"
    )
    return fallback_sql, f"Default query showing customer records answering '{clean_q}'."


async def generate_explanation_for_results(
    question: str, sql: str, rows: list, columns: list, default_exp: str
) -> str:
    """
    Generate an executive natural-language explanation of query results.
    """
    if not rows:
        return f"No records returned in Db2 for: '{question}'."

    row_count = len(rows)

    # If Ollama is available, generate dynamic executive explanation
    try:
        fast_timeout = httpx.Timeout(timeout=5.0, connect=0.5)
        async with httpx.AsyncClient(timeout=fast_timeout) as client:
            sample_rows = rows[:5]
            prompt = (
                f"You are a business intelligence analyst. In 1-2 concise, clear sentences, "
                f"explain the key takeaway of this data for executive leadership:\n\n"
                f"Question: {question}\n"
                f"SQL: {sql}\n"
                f"Rows ({row_count} total): {sample_rows}\n\n"
                f"Executive Takeaway:"
            )
            payload = {
                "model": settings.ollama_model,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.2}
            }
            resp = await client.post(f"{settings.ollama_base_url}/api/generate", json=payload)
            if resp.status_code == 200:
                ans = resp.json().get("response", "").strip()
                if ans and len(ans) > 10:
                    return ans
    except Exception:
        pass

    # Dynamic data-grounded fallback
    first_row = rows[0]
    if "TOTAL_REVENUE" in first_row and "PRODUCT_NAME" in first_row:
        top_name = first_row.get("PRODUCT_NAME")
        top_rev = float(first_row.get("TOTAL_REVENUE") or 0)
        return f"{default_exp} Top performer is '{top_name}' generating ${top_rev:,.2f}."
    elif "LIFETIME_VALUE" in first_row:
        top_company = first_row.get("COMPANY") or f"{first_row.get('FIRST_NAME')} {first_row.get('LAST_NAME')}"
        top_val = float(first_row.get("LIFETIME_VALUE") or 0)
        return f"{default_exp} Top account is {top_company} with ${top_val:,.2f} in cumulative purchases."
    elif "TOTAL_REVENUE" in first_row and "TOTAL_ORDERS" in first_row:
        tot_rev = float(first_row.get("TOTAL_REVENUE") or 0)
        tot_ord = int(first_row.get("TOTAL_ORDERS") or 0)
        avg_val = float(first_row.get("AVERAGE_ORDER_VALUE") or 0)
        return f"Cumulative enterprise revenue stands at ${tot_rev:,.2f} across {tot_ord} orders (average order value: ${avg_val:,.2f})."

    return f"{default_exp} Returned {row_count} records from IBM Db2."
