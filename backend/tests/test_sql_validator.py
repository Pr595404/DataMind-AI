"""
DataMind AI - SQL Validator Tests
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core.sql_validator import validate_sql, sanitize_and_limit


class TestValidateSQL:
    """Tests for the SQL validator."""

    def test_valid_select(self):
        result = validate_sql("SELECT * FROM customers")
        assert result.is_safe is True

    def test_valid_select_with_joins(self):
        sql = (
            "SELECT c.first_name, o.total_amount "
            "FROM customers c JOIN orders o ON c.customer_id = o.customer_id"
        )
        result = validate_sql(sql)
        assert result.is_safe is True

    def test_valid_with_cte(self):
        sql = (
            "WITH top_customers AS (SELECT customer_id, SUM(total_amount) AS total "
            "FROM orders GROUP BY customer_id) "
            "SELECT * FROM top_customers"
        )
        result = validate_sql(sql)
        assert result.is_safe is True

    def test_reject_insert(self):
        result = validate_sql("INSERT INTO customers (first_name) VALUES ('Hacker')")
        assert result.is_safe is False
        assert "INSERT" in result.reason

    def test_reject_update(self):
        result = validate_sql("UPDATE customers SET first_name = 'Hacked'")
        assert result.is_safe is False

    def test_reject_delete(self):
        result = validate_sql("DELETE FROM customers")
        assert result.is_safe is False

    def test_reject_drop(self):
        result = validate_sql("DROP TABLE customers")
        assert result.is_safe is False

    def test_reject_alter(self):
        result = validate_sql("ALTER TABLE customers ADD COLUMN hack VARCHAR(100)")
        assert result.is_safe is False

    def test_reject_create(self):
        result = validate_sql("CREATE TABLE hacker_table (id INT)")
        assert result.is_safe is False

    def test_reject_multi_statement(self):
        result = validate_sql("SELECT 1; DROP TABLE customers")
        assert result.is_safe is False

    def test_reject_empty(self):
        result = validate_sql("")
        assert result.is_safe is False

    def test_reject_whitespace_only(self):
        result = validate_sql("   ")
        assert result.is_safe is False

    def test_reject_comment_injection(self):
        result = validate_sql("SELECT * FROM customers -- DROP TABLE customers")
        assert result.is_safe is False

    def test_strips_trailing_semicolon(self):
        result = validate_sql("SELECT * FROM customers;")
        assert result.is_safe is True
        assert not result.sql.endswith(";")

    def test_reject_select_into(self):
        result = validate_sql("SELECT * INTO backup_table FROM customers")
        assert result.is_safe is False


class TestSanitizeAndLimit:
    """Tests for row limiting."""

    def test_adds_fetch_first(self):
        sql = "SELECT * FROM customers"
        result = sanitize_and_limit(sql, max_rows=10)
        assert "FETCH FIRST 10 ROWS ONLY" in result

    def test_preserves_existing_fetch_first(self):
        sql = "SELECT * FROM customers FETCH FIRST 5 ROWS ONLY"
        result = sanitize_and_limit(sql, max_rows=100)
        # Should not add a second FETCH FIRST
        assert result.count("FETCH FIRST") == 1

    def test_default_limit(self):
        sql = "SELECT * FROM customers"
        result = sanitize_and_limit(sql)
        assert "FETCH FIRST 100 ROWS ONLY" in result


if __name__ == "__main__":
    # Quick run without pytest
    print("Running SQL Validator tests...")
    tests = TestValidateSQL()
    for method_name in dir(tests):
        if method_name.startswith("test_"):
            try:
                getattr(tests, method_name)()
                print(f"  PASS: {method_name}")
            except AssertionError as e:
                print(f"  FAIL: {method_name}: {e}")

    limit_tests = TestSanitizeAndLimit()
    for method_name in dir(limit_tests):
        if method_name.startswith("test_"):
            try:
                getattr(limit_tests, method_name)()
                print(f"  PASS: {method_name}")
            except AssertionError as e:
                print(f"  FAIL: {method_name}: {e}")

    print("\nDone!")
