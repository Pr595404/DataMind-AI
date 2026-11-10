# DataMind AI 🧠

**AI-Powered Business Intelligence Platform — IBM Db2 + LangChain**  
*Built for the IBM Db2 TechX Summit 2026 Hackathon*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.136+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![IBM Db2](https://img.shields.io/badge/IBM%20Db2-Community%20Edition-052FAD?style=flat&logo=ibm&logoColor=white)](https://www.ibm.com/analytics/db2)
[![LangChain](https://img.shields.io/badge/LangChain-Enabled-1C3C3C?style=flat&logo=chainlink&logoColor=white)](https://www.langchain.com)
[![React](https://img.shields.io/badge/React-19+-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tests](https://img.shields.io/badge/Tests-37%20Passed-success?style=flat)]()

---

## 📌 Executive Summary

**DataMind AI** transforms enterprise business intelligence by bridging the gap between non-technical stakeholders and complex relational data. Business executives and analysts can ask natural language questions in plain English (e.g. *"What are our top five products by revenue?"* or *"Why did revenue decrease last month?"*) and receive instant, validated **IBM Db2 SQL queries**, structured records, executive-level summaries, and dynamic interactive visualizations.

---

## ✨ Key Features

1. 💬 **Natural-Language-to-SQL Pipeline:** LangChain-driven schema contextualization translates complex business questions into optimal, dialect-specific IBM Db2 SQL with automatic AST validation.
2. 📊 **Executive BI Dashboard:** Real-time KPI summaries including Total Revenue, Cumulative Order Volume, Customer Counts, and Average Order Value (AOV).
3. 📈 **Dynamic Analytics & Visualizations:** Interactive revenue trend curves, customer segment revenue contributions (Enterprise, Mid-Market, SMB, Startup), and category sales charts powered by Recharts.
4. 🔍 **Business Anomaly Detection:** Proactive detection of statistical and operational anomalies across payment failure rates, order drop-offs, and inventory bottlenecks.
5. 💡 **Actionable Business Recommendations:** Data-grounded, explainable strategic recommendations with impact sizing and suggested operational actions.
6. 🔒 **Enterprise Read-Only Security Guardrails:** AST and regex query sanitizers strictly enforce read-only execution (`SELECT` and `WITH` CTEs), blocking `DROP`, `DELETE`, `UPDATE`, `INSERT`, multi-statement injections, and system procedures.
7. 🛡️ **Fault-Tolerant Hybrid Data Engine:** Native `ibm_db` TCP/IP connection to IBM Db2 with transparent local fallback resilience, ensuring 100% demo availability even in offline or air-gapped demo environments.

---

## 🏗️ Architecture

```
                                  +------------------------------------+
                                  |            DataMind AI             |
                                  |         React 19 + Vite 8          |
                                  |   (Tailwind CSS + Recharts UI)     |
                                  +-----------------+------------------+
                                                    |  REST API (:8000)
                                                    v
                                  +------------------------------------+
                                  |         FastAPI Gateway            |
                                  |   (CORS, Error Masking, Router)    |
                                  +--------+------------------+--------+
                                           |                  |
                        +------------------+                  +------------------+
                        v                                                        v
         +------------------------------+                         +------------------------------+
         |     AI Orchestration Core    |                         |      SQL Security Engine     |
         |    - LangChain Pipeline      |                         |    - Read-Only AST Enforcer  |
         |    - Schema Context Builder  |                         |    - Multi-statement Filter  |
         |    - Intent Matcher Fallback |                         |    - Parameterizer & Limits  |
         |    - Executive Explainer     |                         +--------------+---------------+
         +--------------+---------------+                                        |
                        |                                                        v
                        +--------------------------------------------------------+
                                                    |
                                                    v
                                  +------------------------------------+
                                  |      Core Database Controller      |
                                  +--------+------------------+--------+
                                           |                  |
                   (Production Mode)       v                  v      (Demo / Degraded Mode)
                          +------------------------+  +------------------------+
                          |   IBM Db2 Database     |  | Embedded Seed Database |
                          | (Community Edition)    |  |  (Offline Fallback)    |
                          |   Port 50000 / TCP/IP  |  |   Pre-seeded Schema    |
                          +------------------------+  +------------------------+
```

Detailed technical architecture, flowcharts, and sequence diagrams can be reviewed in [docs/architecture.md](docs/architecture.md).

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ (tested through Python 3.14)
- Node.js v18+ and npm
- Docker Desktop (optional, for local IBM Db2 container)

### 1. Clone & Configure
```bash
git clone https://github.com/<your-username>/datamind-ai.git
cd "datamind ai"

# Copy environment configuration
copy .env.example .env
copy .env.example backend\.env
```

### 2. Launch Backend (FastAPI)
```bash
# Set up Python virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # Windows PowerShell

# Install dependencies
pip install -r backend/requirements.txt

# Start backend server
python -m uvicorn main:app --app-dir backend --host 0.0.0.0 --port 8000
```
- API root: `http://localhost:8000`
- Swagger UI docs: `http://localhost:8000/docs`

### 3. Launch Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🧪 Automated Test Suite

DataMind AI includes a comprehensive test suite covering API endpoints, SQL validation, LangChain intent matching, and query audit logging.

```bash
python -m pytest backend/tests -v
```

### Test Coverage Summary:
```
============================= 37 passed in 5.46s =============================
- backend/tests/test_analytics_and_nl_sql.py     (3 tests passed)
- backend/tests/test_api_endpoints.py            (12 tests passed)
- backend/tests/test_query_history.py            (4 tests passed)
- backend/tests/test_sql_validator.py            (18 tests passed)
```

---

## 📡 API Contract Specification

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Service health, IBM Db2 connection & AI model status |
| `GET` | `/api/schema` | Complete IBM Db2 table metadata & column schemas |
| `GET` | `/api/dashboard/summary` | Executive KPIs (Revenue, Orders, Customers, AOV) |
| `GET` | `/api/dashboard/trends` | Monthly revenue trends and order volumes |
| `GET` | `/api/dashboard/top-products` | Top revenue-generating products |
| `GET` | `/api/dashboard/customer-segments` | Customer cohort metrics & revenue share |
| `POST` | `/api/query` | Natural language question → SQL → Db2 results & explanation |
| `GET` | `/api/query/history` | Full audit log of executed queries & performance |
| `GET` | `/api/anomalies` | Detected payment failure and inventory risk anomalies |
| `GET` | `/api/recommendations` | Explainable, prioritized business recommendations |

Full specifications and schemas are documented in [docs/api-contract.md](docs/api-contract.md).

---

## 🔒 Security & Safe Execution

- **Zero Mutation:** Only `SELECT` statements are executed. All DDL/DML mutations (`DROP`, `INSERT`, `UPDATE`, `ALTER`, `DELETE`) are blocked.
- **Single-Statement Enforcement:** Stacked queries separated by semicolons are strictly rejected.
- **DoS Prevention:** Automatic `FETCH FIRST 1000 ROWS ONLY` pagination and a 30-second query timeout.
- **No Leaked Credentials:** Frontend assets contain zero secrets. Secrets are strictly managed in `.env` and kept out of Git.

Full details in [docs/security.md](docs/security.md).

---

## 👥 Submission Information

- **Hackathon:** IBM Db2 TechX Summit 2026 Hackathon
- **Submission Date:** November 10, 2026
- **Status:** Fully Verified, End-to-End Operational Prototype
