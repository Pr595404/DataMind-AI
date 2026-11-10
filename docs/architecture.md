# DataMind AI — System Architecture & Design

**IBM Db2 + LangChain Business Intelligence Platform**  
*IBM Db2 TechX Summit 2026 Hackathon*

---

## 1. High-Level Architecture

DataMind AI is an enterprise-grade AI-powered business intelligence application that transforms natural language questions into secure, optimized SQL queries executed against **IBM Db2**, with built-in LangChain orchestration, explainability, real-time dashboard analytics, and anomaly detection.

```mermaid
flowchart TD
    User([Business Executive / Analyst]) <-->|Natural Language Queries & Visualizations| FE["Frontend UI (React 19 + TypeScript + Tailwind CSS + Recharts)"]
    
    subgraph API_Gateway ["FastAPI Application Gateway (:8000)"]
        CORS["Strict CORS Middleware"]
        Val["SQL & Schema Validation Engine"]
        Sec["Security Guardrails & Parameterizer"]
    end
    
    FE <-->|REST API JSON| API_Gateway
    
    subgraph AI_Core ["AI Orchestration Layer"]
        LC["LangChain Engine"]
        Intent["Intelligent Intent Classifier"]
        Ollama["Local LLM / Ollama (Mistral / Llama)"]
        ExpGen["Executive Explanation Generator"]
    end
    
    API_Gateway <--> AI_Core
    
    subgraph Data_Tier ["Data Layer"]
        Db2["IBM Db2 Community Edition (:50000)"]
        Fallback["Local Zero-Latency Fallback Engine (SQLite Pre-seeded)"]
        Hist["Query History & Audit Log"]
    end
    
    API_Gateway -->|ibm_db native TCP/IP Driver| Db2
    API_Gateway -.->|Auto-failover if Db2 unreachable| Fallback
    API_Gateway --> Hist
```

---

## 2. Component Breakdown

### 2.1 Frontend Client
- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS 4 with modern executive dark/light glassmorphic theme
- **Visualization:** Recharts for monthly revenue trends, customer segment breakdown, and category sales
- **State Management:** TanStack React Query 5 for caching, background re-validation, and optimistic updates
- **Components:**
  - Executive KPI dashboard (Total Revenue, Orders, Customers, AOV, Top Categories)
  - Interactive AI Natural Language Query console with instant SQL preview, table inspector, and business explanation
  - Anomaly detection monitor for real-time risk alerts
  - Data-driven business recommendations engine
  - Schema explorer and full audit query history log

### 2.2 Backend Gateway & AI Pipeline
- **Framework:** FastAPI (Python 3.14/3.10) with asynchronous ASGI architecture
- **Orchestration:** LangChain with structured prompt templates, dynamic schema injection, and executive explainers
- **Security Validation:** Deterministic AST/Regex SQL Validator that strictly enforces read-only queries (`SELECT`, `WITH`) and rejects multi-statement or DDL/DML mutations
- **Database Driver:** Native `ibm_db` C-extension connecting via TCP/IP to IBM Db2 Community Edition on port 50000
- **Resilience:** Automatic degraded mode fallback to an embedded seed database ensuring 100% platform availability during demonstrations or network disruptions

---

## 3. End-to-End Query Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User as Business User
    participant UI as React Dashboard
    participant API as FastAPI Gateway
    participant AI as LangChain / Intent Engine
    participant Sec as SQL Security Validator
    participant DB as IBM Db2 Database

    User->>UI: "What are our top five products by revenue?"
    UI->>API: POST /api/query { question, max_rows: 5 }
    API->>AI: Translate Question to Db2 SQL
    AI->>AI: Inject Db2 Schema Context (tables, columns, types)
    AI-->>API: Generated SQL (e.g. SELECT ... FETCH FIRST 5 ROWS ONLY)
    API->>Sec: Validate SQL AST & Safety
    Sec-->>API: Safe: True (Only SELECT/CTE allowed)
    API->>DB: Execute Query via ibm_db TCP/IP
    DB-->>API: Structured Record Rows & Columns
    API->>AI: Generate Executive Business Takeaway
    AI-->>API: Natural-language Business Summary
    API->>DB: Log Audit to query_history
    API-->>UI: 200 OK (SQL, Rows, Columns, Explanation, Chart Suggestion)
    UI-->>User: Render Interactive Data Table, SQL Inspector & Summary
```

---

## 4. Database Schema

The core enterprise schema contains 5 primary relational tables:

1. **`CUSTOMERS`**: Account profile, business segment (Enterprise, Mid-Market, SMB, Startup), location, and registration timestamps.
2. **`PRODUCTS`**: Product catalog, category hierarchies, unit pricing, and current inventory stock levels.
3. **`ORDERS`**: Transactional orders, fulfillment statuses (Completed, Processing, Cancelled, Refunded), order totals, and timestamps.
4. **`ORDER_ITEMS`**: Normalized order line items linking orders with specific products, quantities, and price multipliers.
5. **`TRANSACTIONS`**: Financial transaction audit trail tracking payment methods, status (Success, Failed, Declined), and processed amounts.
6. **`QUERY_HISTORY`**: Security audit log capturing every natural language question, generated SQL, execution duration, and status.
