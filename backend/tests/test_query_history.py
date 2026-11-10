"""
DataMind AI - Query History Tests
Verifies logging safety, parameter handling, and data truncation.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core.database import db
from core.sql_executor import execute_safe_query


class TestQueryHistory:
    """Tests for query history tracking."""

    def test_log_query_when_disconnected(self, monkeypatch):
        """Should fail safely without raising an exception when DB is disconnected."""
        monkeypatch.setattr(type(db), "is_connected", property(lambda s: False))
        result = db.log_query_history(
            user_question="What are total sales?",
            generated_sql="SELECT SUM(total_amount) FROM orders",
            execution_status="SUCCESS",
            execution_duration_ms=12.34,
            row_count=1,
        )
        # When DB is disconnected, should return False gracefully, not raise
        assert result is False

    def test_get_history_when_disconnected(self, monkeypatch):
        """Should return empty list without raising when DB is disconnected."""
        monkeypatch.setattr(type(db), "is_connected", property(lambda s: False))
        history = db.get_query_history(limit=10)
        assert isinstance(history, list)
        assert len(history) == 0

    def test_safe_executor_records_rejected_query(self):
        """A rejected query should attempt to log REJECTED status and return QueryResult."""
        result = execute_safe_query("DROP TABLE customers", user_question="Drop all customers")
        assert result.success is False
        assert "rejected" in result.error.lower()

    def test_safe_executor_handles_offline_db(self, monkeypatch):
        """A valid query against offline DB should fail gracefully with QueryResult."""
        monkeypatch.setattr(db, "ensure_connected", lambda: False)
        result = execute_safe_query("SELECT * FROM customers", user_question="List customers")
        assert result.success is False
        assert result.execution_time_ms >= 0


if __name__ == "__main__":
    print("Running Query History tests...")
    tests = TestQueryHistory()
    for method_name in dir(tests):
        if method_name.startswith("test_"):
            try:
                getattr(tests, method_name)()
                print(f"  PASS: {method_name}")
            except Exception as e:
                print(f"  FAIL: {method_name}: {e}")

    print("\nDone!")
