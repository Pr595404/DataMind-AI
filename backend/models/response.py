"""
DataMind AI - Pydantic Response Models
"""
from pydantic import BaseModel, Field
from typing import Any


class HealthResponse(BaseModel):
    """Response for health check endpoint."""
    status: str
    database: dict[str, Any]
    ai_service: dict[str, Any]
    version: str = "0.1.0"


class SchemaTableResponse(BaseModel):
    """Response for single table schema."""
    table_name: str
    columns: list[dict[str, Any]]


class SchemaResponse(BaseModel):
    """Response for full schema endpoint."""
    tables: list[str]
    schema_details: dict[str, list[dict[str, Any]]] = Field(
        ...,
        description="Mapping of table name to column metadata definitions",
    )


class QueryResponse(BaseModel):
    """Response for natural language query endpoint."""
    question: str
    generated_sql: str
    is_safe: bool
    columns: list[str] = []
    rows: list[dict[str, Any]] = []
    row_count: int = 0
    explanation: str = ""
    chart_suggestion: str = "table"
    execution_time_ms: float = 0.0
    error: str | None = None


class DashboardSummary(BaseModel):
    """Response for dashboard summary endpoint."""
    total_customers: int = 0
    total_products: int = 0
    total_orders: int = 0
    total_revenue: float = 0.0
    avg_order_value: float = 0.0
    top_category: str = ""
    top_customer_segment: str = ""


class AnomalyItem(BaseModel):
    """A single detected anomaly."""
    title: str
    description: str
    severity: str = "medium"  # low, medium, high
    metric: str = ""
    value: float = 0.0
    expected: float = 0.0


class AnomalyResponse(BaseModel):
    """Response for anomaly detection endpoint."""
    anomalies: list[AnomalyItem] = []
    analysis_summary: str = ""


class ErrorResponse(BaseModel):
    """Standard error response."""
    error: str
    detail: str = ""
