# DataMind AI — Setup & Installation Guide

This guide covers running DataMind AI locally on Windows, macOS, or Linux.

---

## 1. Prerequisites

- **Python:** 3.10 to 3.14
- **Node.js:** v18+ and npm
- **Docker:** (Optional, for running local IBM Db2 Community Edition)
- **Git**

---

## 2. Quick Local Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/datamind-ai.git
cd "datamind-ai"
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` in the root and in `backend/`:
```bash
copy .env.example .env
copy .env.example backend\.env
```

Default `.env` configuration:
```env
DB2_HOST=localhost
DB2_PORT=50000
DB2_DATABASE=DATAMIND
DB2_USER=db2inst1
DB2_PASSWORD=datamind2026
DB2_SCHEMA=DB2INST1

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral

APP_HOST=0.0.0.0
APP_PORT=8000
APP_DEBUG=true

MAX_QUERY_ROWS=1000
QUERY_TIMEOUT_SECONDS=30
```

---

## 3. Starting IBM Db2 (Docker)

If you have Docker installed, start an IBM Db2 Community Edition container:

```bash
docker run -d --name datamind-db2 --privileged -p 50000:50000 \
  -e DB2INST1_PASSWORD=datamind2026 \
  -e DBNAME=DATAMIND \
  -e LICENSE=accept \
  ibmcom/db2
```

Once the container reports healthy, seed the database:
```bash
docker exec -i datamind-db2 su - db2inst1 -c "db2 connect to DATAMIND"
docker exec -i datamind-db2 su - db2inst1 -c "db2 -tvf backend/db/schema.sql"
docker exec -i datamind-db2 su - db2inst1 -c "db2 -tvf backend/db/seed_data.sql"
```

*Note: If IBM Db2 is not running, DataMind AI automatically switches to its local fallback engine with identical pre-seeded schema and data, ensuring uninterrupted development and testing.*

---

## 4. Starting the Backend

1. Create and activate a Python virtual environment:
```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # Windows PowerShell
# source .venv/bin/activate    # Linux / macOS
```

2. Install dependencies:
```bash
pip install -r backend/requirements.txt
```

3. Run the backend API server:
```bash
python -m uvicorn main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```
The API is available at:
- **API URL:** `http://localhost:8000`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`

---

## 5. Starting the Frontend

1. Navigate to the `frontend/` directory:
```bash
cd frontend
npm install
```

2. Start the Vite development server:
```bash
npm run dev
```

3. Open your browser at:
`http://localhost:5173`

---

## 6. Running Tests

Run the full automated test suite (37 unit & integration tests):
```bash
python -m pytest backend/tests -v
```

All tests validate:
- Natural-language to SQL translation
- SQL injection rejection and query safety
- All 10 REST API endpoints
- IBM Db2 connection handling and fallback resilience
- Database query history audit logging
