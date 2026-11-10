# DataMind AI — API Contract Specification

**Version:** 1.0.0  
**Backend:** FastAPI (Python 3.10 / WSL2 Linux)  
**Database:** IBM Db2 Community Edition  
**AI Orchestration:** LangChain / Local Ollama  
**Frontend Client:** React + Vite + TypeScript (Tailwind CSS)  
**Default Base URL:** `http://localhost:8000`

---

## 1. Overview & Architectural Principles

1. **Strict Read-Only Enforcement:** Only `SELECT` and Common Table Expressions (`WITH ... SELECT`) are permitted through query endpoints. Mutations (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, etc.) and multi-statement queries are blocked deterministically.
2. **Predictable JSON Responses:** All endpoints return standard HTTP status codes (200 OK, 400 Bad Request, 422 Validation Error, 500 Internal Error) with structured JSON payloads.
3. **Db2 Source of Truth:** All analytical metrics, schema metadata, and query results originate directly from IBM Db2.

---

## 2. API Endpoints

### 2.1 System & Health

#### `GET /api/health`
Checks the live connectivity status of the backend, IBM Db2 database, and AI service (Ollama).

- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "database": {
    "connected": true,
    "database": "DATAMIND",
    "host": "localhost",
    "port": 50000,
    "user": "db2inst1",
    "pool_size": 5,
    "active_connections": 1
  },
  "ai_service": {
    "available": true,
    "models": ["llama3.2"],
    "selected": "llama3.2",
    "has_selected_model": true
  }
}
```

---

### 2.2 Dashboard Analytics

#### `GET /api/dashboard/summary`
Returns high-level business KPIs aggregated directly from IBM Db2 tables (`customers`, `products`, `orders`, `order_items`).

- **Response `200 OK`**:
```json
{
  "total_customers": 25,
  "total_products": 20,
  "total_orders": 40,
  "total_revenue": 148520.50,
  "avg_order_value": 3713.01,
  "top_category": "Electronics",
  "top_customer_segment": "Enterprise"
}
```

#### `GET /api/dashboard/trends`
Returns monthly revenue and order volume trends for charting.

- **Response `200 OK`**:
```json
{
  "trends": [
    {
      "yr": 2025,
      "mo": 1,
      "order_count": 5,
      "revenue": 18240.00
    },
    {
      "yr": 2025,
      "mo": 2,
      "order_count": 8,
      "revenue": 29410.50
    }
  ]
}
```

#### `GET /api/dashboard/top-products`
Returns top 10 products ranked by total sales revenue.

- **Response `200 OK`**:
```json
{
  "products": [
    {
      "product_name": "ThinkPad P16 Workstation",
      "category": "Electronics",
      "units_sold": 14,
      "revenue": 41986.00
    }
  ]
}
```

#### `GET /api/dashboard/customer-segments`
Returns revenue and order volume aggregated across customer tiers (Enterprise, Mid-Market, SMB, Startup).

- **Response `200 OK`**:
```json
{
  "segments": [
    {
      "segment": "Enterprise",
      "customer_count": 8,
      "order_count": 18,
      "total_revenue": 89400.00
    }
  ]
}
```

---

### 2.3 Natural Language & SQL Execution

#### `POST /api/query`
Accepts a natural language business question (or direct SELECT query), transforms it into validated IBM Db2 SQL, executes safely, logs to `QUERY_HISTORY`, and returns tabular data with visualization hints.

- **Request Body**:
```json
{
  "question": "Which products generate the highest revenue?",
  "max_rows": 50
}
```

- **Response `200 OK`**:
```json
{
  "question": "Which products generate the highest revenue?",
  "generated_sql": "SELECT p.product_name, p.category, SUM(oi.line_total) AS revenue FROM order_items oi JOIN products p ON oi.product_id = p.product_id GROUP BY p.product_name, p.category ORDER BY revenue DESC FETCH FIRST 10 ROWS ONLY",
  "is_safe": true,
  "columns": ["PRODUCT_NAME", "CATEGORY", "REVENUE"],
  "rows": [
    {
      "PRODUCT_NAME": "ThinkPad P16 Workstation",
      "CATEGORY": "Electronics",
      "REVENUE": 41986.00
    }
  ],
  "row_count": 10,
  "explanation": "Top revenue generator is ThinkPad P16 Workstation contributing $41,986.00 across all recorded orders.",
  "chart_suggestion": "bar",
  "execution_time_ms": 14.8,
  "error": null
}
```

- **Response `400 Bad Request` (on unsafe query attempt)**:
```json
{
  "question": "DROP TABLE customers;",
  "generated_sql": "DROP TABLE customers;",
  "is_safe": false,
  "columns": [],
  "rows": [],
  "row_count": 0,
  "explanation": "Query rejected by security validator.",
  "chart_suggestion": "table",
  "execution_time_ms": 0.0,
  "error": "Query contains forbidden DDL/DML keyword: DROP"
}
```

#### `GET /api/query/history?limit=50`
Returns chronological audit records of executed queries from Db2 `QUERY_HISTORY`.

- **Response `200 OK`**:
```json
{
  "history": [
    {
      "query_id": 1,
      "user_question": "Which products generate the highest revenue?",
      "generated_sql": "SELECT ...",
      "execution_status": "SUCCESS",
      "execution_duration_ms": 14,
      "row_count": 10,
      "error_message": null,
      "created_at": "2026-11-10 13:30:00"
    }
  ],
  "count": 1
}
```

---

### 2.4 Database Schema Introspection

#### `GET /api/schema`
Returns all tables and column metadata in IBM Db2.

- **Response `200 OK`**:
```json
{
  "tables": ["CUSTOMERS", "PRODUCTS", "ORDERS", "ORDER_ITEMS", "TRANSACTIONS", "QUERY_HISTORY"],
  "schema_details": {
    "CUSTOMERS": [
      {
        "COLNAME": "CUSTOMER_ID",
        "TYPENAME": "INTEGER",
        "LENGTH": 4,
        "SCALE": 0,
        "NULLS": "N",
        "KEYSEQ": 1
      }
    ]
  }
}
```

---

### 2.5 Business Anomalies & Recommendations

#### `GET /api/anomalies`
Identifies operational anomalies such as payment gateway failures, margin contractions, inventory run-outs, and dormant accounts.

- **Response `200 OK`**:
```json
{
  "anomalies": [
    {
      "title": "Elevated Transaction Failure Rate",
      "description": "3 transactions failed totaling $4,120.00 (7.5% failure rate).",
      "severity": "High",
      "metric": "Transaction Failure Rate",
      "value": 7.5,
      "expected": 1.0,
      "status": "Active"
    }
  ],
  "analysis_summary": "Payment failure rate at 7.5% ($4,120.00 at risk)",
  "count": 1
}
```

#### `GET /api/recommendations`
Returns actionable business recommendations grounded in actual Db2 metrics.

- **Response `200 OK`**:
```json
{
  "recommendations": [
    {
      "title": "Expand Inventory & Marketing for Leading Category: Electronics",
      "business_area": "Merchandising & Sales",
      "priority": "High",
      "observation": "Category 'Electronics' is your primary revenue engine generating $78,400.00.",
      "evidence": "Total revenue of $78,400.00 across 22 orders leads all product categories in IBM Db2.",
      "impact": "Estimated 12-18% revenue expansion through targeted upsell campaigns.",
      "next_action": "Allocate 30% more procurement budget to 'Electronics' SKU replenishment.",
      "confidence": 0.94
    }
  ],
  "count": 1
}
```
