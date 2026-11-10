"""
DataMind AI - Natural Language Query Route
Handles NL → SQL → Db2 → Results pipeline.
"""
from fastapi import APIRouter, HTTPException
import logging

from core.database import db
from core.sql_executor import execute_safe_query
from models.request import QueryRequest
from models.response import QueryResponse
from ai.chains.nl_to_sql import generate_sql_for_question, generate_explanation_for_results

router = APIRouter(prefix="/api", tags=["query"])
logger = logging.getLogger(__name__)


@router.get("/query/history")
async def get_history(limit: int = 50):
    """Retrieve audit history of recent executed queries."""
    history = db.get_query_history(limit=limit)
    return {"history": history, "count": len(history)}


@router.post("/query", response_model=QueryResponse)
async def natural_language_query(request: QueryRequest):
    """
    Accept a natural language business question, generate SQL via AI/schema context,
    validate for read-only safety, execute against IBM Db2, and return structured results
    with chart suggestion and executive explanation.
    """
    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    # 1. Translate NL to Db2 SQL (using Ollama LLM with schema context or resilient intent mapping)
    generated_sql, default_exp = await generate_sql_for_question(question)

    # 2. Execute safe query (enforces read-only validation and Db2 pagination)
    result = execute_safe_query(generated_sql, max_rows=request.max_rows)

    # 3. Generate chart suggestion and executive summary
    chart_type = _suggest_chart(result.columns, result.row_count)
    explanation = await generate_explanation_for_results(
        question, result.sql_executed, result.rows, result.columns, default_exp
    )

    return QueryResponse(
        question=question,
        generated_sql=result.sql_executed,
        is_safe=result.success,
        columns=result.columns,
        rows=result.rows,
        row_count=result.row_count,
        explanation=explanation,
        chart_suggestion=chart_type,
        execution_time_ms=result.execution_time_ms,
        error=result.error,
    )


def _suggest_chart(columns: list[str], row_count: int) -> str:
    """Suggest a chart type based on result structure."""
    if row_count == 0:
        return "table"

    col_count = len(columns)

    # Single value → KPI card
    if row_count == 1 and col_count == 1:
        return "kpi"

    # Two columns, one looks numeric → bar or pie chart
    if col_count == 2 and row_count <= 10:
        return "pie" if row_count <= 6 else "bar"

    # Has a date-like column → line chart
    date_keywords = {"DATE", "MONTH", "YEAR", "QUARTER", "WEEK", "DAY", "TIME"}
    if any(kw in col.upper() for col in columns for kw in date_keywords):
        return "line"

    # Multiple numeric columns → bar chart
    if col_count >= 2:
        return "bar"

    return "table"
