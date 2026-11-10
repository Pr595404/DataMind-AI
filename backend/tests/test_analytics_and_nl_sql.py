"""
DataMind AI - Unit Tests for Analytics, Recommendations & NL-to-SQL
"""
import pytest
import asyncio
from ai.chains.nl_to_sql import generate_sql_for_question, generate_explanation_for_results
from core.sql_validator import validate_sql


def test_nl_to_sql_intent_matching():
    """Verify natural language business queries map to valid Db2 SQL."""
    test_cases = [
        "What are our top products by revenue?",
        "Show me total revenue and sales",
        "Which customers have the highest lifetime value?",
        "What are our customer segments?",
        "Why did revenue decrease last month? Show trends",
        "Are there any failed transactions?",
        "Which products have low stock?",
        "Show recent orders",
    ]

    for question in test_cases:
        sql, explanation = asyncio.run(generate_sql_for_question(question))
        assert sql is not None and len(sql) > 0, f"No SQL generated for: {question}"
        assert explanation is not None and len(explanation) > 0

        # Validate that generated SQL passes safety checks
        result = validate_sql(sql)
        assert result.is_safe, f"Generated SQL failed validation: {sql} | Error: {result.reason}"


def test_nl_to_sql_blocks_dangerous_injection():
    """Verify SQL injection or dangerous questions are neutralized."""
    malicious_question = "DROP TABLE customers;"
    sql, _ = asyncio.run(generate_sql_for_question(malicious_question))
    result = validate_sql(sql)
    assert not result.is_safe, f"Malicious query should be rejected: {sql}"


def test_explanation_generator():
    """Verify explanation generator handles empty and non-empty rows."""
    exp_empty = asyncio.run(
        generate_explanation_for_results("test question", "SELECT 1 FROM orders", [], [], "Default")
    )
    assert "No records" in exp_empty

    sample_rows = [{"PRODUCT_NAME": "ThinkPad P16", "TOTAL_REVENUE": 42000.0}]
    exp_filled = asyncio.run(
        generate_explanation_for_results(
            "top products", "SELECT ...", sample_rows, ["PRODUCT_NAME", "TOTAL_REVENUE"], "Top products summary."
        )
    )
    assert "ThinkPad P16" in exp_filled
    assert "42,000.00" in exp_filled
