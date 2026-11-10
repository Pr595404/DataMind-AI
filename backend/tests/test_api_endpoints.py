"""
DataMind AI - API Endpoint Integration Tests
Validates all 10 FastAPI routes for correct status codes, response schemas, and error handling.
"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root_endpoint():
    """Verify API metadata."""
    response = client.get("/api/info")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "DataMind AI"
    assert "version" in data
    assert data["health"] == "/api/health"


def test_health_endpoint():
    """Verify GET /api/health returns database and AI status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("healthy", "degraded")
    assert "database" in data
    assert "ai_service" in data


def test_schema_endpoint():
    """Verify GET /api/schema returns table list and schema details."""
    response = client.get("/api/schema")
    assert response.status_code == 200
    data = response.json()
    assert "tables" in data
    assert "schema_details" in data


def test_dashboard_summary():
    """Verify GET /api/dashboard/summary returns required KPIs."""
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_customers" in data
    assert "total_products" in data
    assert "total_orders" in data
    assert "total_revenue" in data
    assert "avg_order_value" in data


def test_dashboard_trends():
    """Verify GET /api/dashboard/trends returns trend points."""
    response = client.get("/api/dashboard/trends")
    assert response.status_code == 200
    data = response.json()
    assert "trends" in data
    assert isinstance(data["trends"], list)


def test_dashboard_top_products():
    """Verify GET /api/dashboard/top-products returns products."""
    response = client.get("/api/dashboard/top-products")
    assert response.status_code == 200
    data = response.json()
    assert "products" in data
    assert isinstance(data["products"], list)


def test_dashboard_customer_segments():
    """Verify GET /api/dashboard/customer-segments returns segments."""
    response = client.get("/api/dashboard/customer-segments")
    assert response.status_code == 200
    data = response.json()
    assert "segments" in data
    assert isinstance(data["segments"], list)


def test_query_nl_endpoint():
    """Verify POST /api/query accepts business question and returns QueryResponse."""
    payload = {"question": "What are our top products by revenue?", "max_rows": 10}
    response = client.post("/api/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "question" in data
    assert "generated_sql" in data
    assert "is_safe" in data
    assert "columns" in data
    assert "rows" in data
    assert "explanation" in data
    assert "chart_suggestion" in data


def test_query_injection_blocked():
    """Verify POST /api/query rejects dangerous DDL/DML injection."""
    payload = {"question": "DROP TABLE customers;", "max_rows": 10}
    response = client.post("/api/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_safe"] is False
    assert data["error"] is not None


def test_query_history_endpoint():
    """Verify GET /api/query/history returns audit records."""
    response = client.get("/api/query/history?limit=10")
    assert response.status_code == 200
    data = response.json()
    assert "history" in data
    assert "count" in data


def test_anomalies_endpoint():
    """Verify GET /api/anomalies returns business anomalies and analysis summary."""
    response = client.get("/api/anomalies")
    assert response.status_code == 200
    data = response.json()
    assert "anomalies" in data
    assert "analysis_summary" in data
    assert "count" in data
    assert isinstance(data["anomalies"], list)


def test_recommendations_endpoint():
    """Verify GET /api/recommendations returns strategic recommendations."""
    response = client.get("/api/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert "count" in data
    assert isinstance(data["recommendations"], list)
