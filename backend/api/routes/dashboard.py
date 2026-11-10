"""
DataMind AI - Dashboard Data Routes
Pre-defined queries for dashboard KPIs and trends.
"""
from fastapi import APIRouter, HTTPException
import logging

from core.database import db
from core.sql_executor import execute_safe_query
from models.response import DashboardSummary

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])
logger = logging.getLogger(__name__)


@router.get("/summary", response_model=DashboardSummary)
async def dashboard_summary():
    """
    Return key business metrics for the dashboard.
    Uses pre-defined queries — works without AI.
    """
    try:
        summary = DashboardSummary()

        # Total customers
        result = execute_safe_query("SELECT COUNT(*) AS cnt FROM customers")
        if result.success and result.rows:
            summary.total_customers = int(result.rows[0].get("CNT", 0))

        # Total products
        result = execute_safe_query("SELECT COUNT(*) AS cnt FROM products")
        if result.success and result.rows:
            summary.total_products = int(result.rows[0].get("CNT", 0))

        # Total orders and revenue
        result = execute_safe_query(
            "SELECT COUNT(*) AS cnt, "
            "COALESCE(SUM(total_amount), 0) AS revenue, "
            "COALESCE(AVG(total_amount), 0) AS avg_val "
            "FROM orders"
        )
        if result.success and result.rows:
            row = result.rows[0]
            summary.total_orders = int(row.get("CNT", 0))
            summary.total_revenue = float(row.get("REVENUE", 0))
            summary.avg_order_value = round(float(row.get("AVG_VAL", 0)), 2)

        # Top category by revenue
        result = execute_safe_query(
            "SELECT p.category, SUM(oi.line_total) AS rev "
            "FROM order_items oi "
            "JOIN products p ON oi.product_id = p.product_id "
            "GROUP BY p.category "
            "ORDER BY rev DESC "
            "FETCH FIRST 1 ROW ONLY"
        )
        if result.success and result.rows:
            summary.top_category = result.rows[0].get("CATEGORY", "")

        # Top customer segment
        result = execute_safe_query(
            "SELECT segment, COUNT(*) AS cnt "
            "FROM customers "
            "GROUP BY segment "
            "ORDER BY cnt DESC "
            "FETCH FIRST 1 ROW ONLY"
        )
        if result.success and result.rows:
            summary.top_customer_segment = result.rows[0].get("SEGMENT", "")

        return summary

    except Exception as e:
        logger.error("Dashboard summary failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/trends")
async def dashboard_trends():
    """Return monthly order trends for charting."""
    try:
        result = execute_safe_query(
            "SELECT YEAR(order_date) AS yr, MONTH(order_date) AS mo, "
            "COUNT(*) AS order_count, SUM(total_amount) AS revenue "
            "FROM orders "
            "GROUP BY YEAR(order_date), MONTH(order_date) "
            "ORDER BY yr, mo"
        )
        if result.success:
            return {"trends": result.rows}
        else:
            return {"trends": [], "error": result.error}
    except Exception as e:
        logger.error("Dashboard trends failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/top-products")
async def top_products():
    """Return top 10 products by revenue."""
    try:
        result = execute_safe_query(
            "SELECT p.product_name, p.category, "
            "SUM(oi.quantity) AS units_sold, "
            "SUM(oi.line_total) AS revenue "
            "FROM order_items oi "
            "JOIN products p ON oi.product_id = p.product_id "
            "GROUP BY p.product_name, p.category "
            "ORDER BY revenue DESC "
            "FETCH FIRST 10 ROWS ONLY"
        )
        if result.success:
            return {"products": result.rows}
        else:
            return {"products": [], "error": result.error}
    except Exception as e:
        logger.error("Top products query failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/customer-segments")
async def customer_segments():
    """Return customer segment breakdown."""
    try:
        result = execute_safe_query(
            "SELECT c.segment, COUNT(DISTINCT c.customer_id) AS customer_count, "
            "COUNT(o.order_id) AS order_count, "
            "COALESCE(SUM(o.total_amount), 0) AS total_revenue "
            "FROM customers c "
            "LEFT JOIN orders o ON c.customer_id = o.customer_id "
            "GROUP BY c.segment "
            "ORDER BY total_revenue DESC"
        )
        if result.success:
            return {"segments": result.rows}
        else:
            return {"segments": [], "error": result.error}
    except Exception as e:
        logger.error("Customer segments query failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))
