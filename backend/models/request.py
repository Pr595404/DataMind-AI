"""
DataMind AI - Pydantic Request Models
"""
from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    """Request body for natural language query endpoint."""
    question: str = Field(
        ...,
        min_length=3,
        max_length=1000,
        description="Natural language business question",
        examples=["What were total sales last quarter?"],
    )
    max_rows: int = Field(
        default=100,
        ge=1,
        le=1000,
        description="Maximum number of rows to return",
    )


class RecommendationRequest(BaseModel):
    """Request body for business recommendation endpoint."""
    focus_area: str = Field(
        default="general",
        description="Area to focus recommendations on",
        examples=["sales", "inventory", "customers"],
    )
    time_period: str = Field(
        default="last_quarter",
        description="Time period to analyze",
        examples=["last_month", "last_quarter", "last_year"],
    )
