"""
DataMind AI - SQL Executor
Safe query execution with timeout and row limiting.
"""
import time
import logging
from typing import Any

from core.database import db
from core.sql_validator import validate_sql, sanitize_and_limit
from config import settings

logger = logging.getLogger(__name__)


class QueryResult:
    """Encapsulates the result of a safe query execution."""

    def __init__(
        self,
        success: bool,
        columns: list[str] = None,
        rows: list[dict] = None,
        row_count: int = 0,
        execution_time_ms: float = 0.0,
        error: str | None = None,
        sql_executed: str = "",
    ):
        self.success = success
        self.columns = columns or []
        self.rows = rows or []
        self.row_count = row_count
        self.execution_time_ms = execution_time_ms
        self.error = error
        self.sql_executed = sql_executed

    def to_dict(self) -> dict[str, Any]:
        return {
            "success": self.success,
            "columns": self.columns,
            "rows": self.rows,
            "row_count": self.row_count,
            "execution_time_ms": self.execution_time_ms,
            "error": self.error,
        }


def execute_safe_query(sql: str, max_rows: int = None, user_question: str = "") -> QueryResult:
    """
    Validate, limit, and execute a SQL query safely.

    Steps:
    1. Validate the SQL is read-only (SELECT only).
    2. Add row limit if not present.
    3. Execute against Db2.
    4. Log query metadata to QUERY_HISTORY.
    5. Return structured result.

    Args:
        sql: The SQL statement to execute.
        max_rows: Maximum rows to return (default from settings).
        user_question: The original user question or prompt for logging.

    Returns:
        QueryResult with data or error information.
    """
    if max_rows is None:
        max_rows = settings.max_query_rows

    # Clamp max_rows
    max_rows = min(max_rows, settings.max_query_rows)

    # Step 1: Validate
    validation = validate_sql(sql)
    if not validation.is_safe:
        logger.warning("Query rejected: %s | SQL: %s", validation.reason, sql[:200])
        db.log_query_history(
            user_question=user_question or sql,
            generated_sql=sql,
            execution_status="REJECTED",
            execution_duration_ms=0.0,
            row_count=0,
            error_message=f"Query rejected: {validation.reason}",
        )
        return QueryResult(
            success=False,
            error=f"Query rejected: {validation.reason}",
            sql_executed=sql,
        )

    # Step 2: Add row limit
    limited_sql = sanitize_and_limit(validation.sql, max_rows)

    # Step 3: Execute
    start_time = time.perf_counter()
    try:
        result = db.execute_query(limited_sql)
        elapsed_ms = (time.perf_counter() - start_time) * 1000

        logger.info(
            "Query executed: %d rows in %.1fms | SQL: %s",
            result["row_count"], elapsed_ms, limited_sql[:100]
        )

        db.log_query_history(
            user_question=user_question or limited_sql,
            generated_sql=limited_sql,
            execution_status="SUCCESS",
            execution_duration_ms=round(elapsed_ms, 2),
            row_count=result["row_count"],
            error_message=None,
        )

        return QueryResult(
            success=True,
            columns=result["columns"],
            rows=result["rows"],
            row_count=result["row_count"],
            execution_time_ms=round(elapsed_ms, 2),
            sql_executed=limited_sql,
        )

    except Exception as e:
        elapsed_ms = (time.perf_counter() - start_time) * 1000
        error_msg = str(e)
        logger.error("Query failed after %.1fms: %s", elapsed_ms, error_msg)

        db.log_query_history(
            user_question=user_question or limited_sql,
            generated_sql=limited_sql,
            execution_status="FAILED",
            execution_duration_ms=round(elapsed_ms, 2),
            row_count=0,
            error_message=error_msg,
        )

        return QueryResult(
            success=False,
            execution_time_ms=round(elapsed_ms, 2),
            error=f"Query execution failed: {error_msg}",
            sql_executed=limited_sql,
        )
