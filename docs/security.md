# DataMind AI — Security Architecture & Threat Model

DataMind AI enforces a zero-trust multi-layered security model to protect enterprise database infrastructure from malicious queries, data exfiltration, and unauthorized mutation.

---

## 1. Mandatory Read-Only Query Enforcement

AI-generated or user-submitted SQL is strictly restricted to read-only operations. Mutating or administrative SQL statements are rejected before reaching the database execution engine.

### Blocked SQL Keywords:
- `INSERT`, `UPDATE`, `DELETE`, `MERGE` (Data modification)
- `DROP`, `TRUNCATE`, `ALTER`, `CREATE`, `RENAME` (Schema modification)
- `GRANT`, `REVOKE` (Permission changes)
- `EXECUTE`, `EXEC`, `CALL` (Stored procedure invocation)
- `COMMENT`, `SET` (Session and object modification)

### Validation Rules:
1. **Starting Keyword Enforcement:** Queries must strictly begin with `SELECT` or `WITH` (for Common Table Expressions).
2. **Single-Statement Enforcement:** Semicolons followed by additional SQL tokens are rejected to prevent stacked-query attacks.
3. **No Stored Procedure / System Script Calls:** System packages (`SYSPROC.`, `SYSFUN.`, `xp_*`, `sp_*`) are blocked.
4. **No SELECT INTO:** Table generation via query (`SELECT ... INTO`) is forbidden.
5. **AST & Pattern Verification:** Every SQL string is normalized, trimmed, and evaluated through regex and structural rules in `backend/core/sql_validator.py`.

---

## 2. SQL Injection Neutralization

- **Regex & Pattern Blocklist:** Comments (`--`, `/* ... */`) that could mask injected payloads are stripped and flagged.
- **Query Parameterization:** Operational and audit queries utilize parameterized placeholders (`?`) preventing variable injection.
- **Deterministic Intent Matching:** Core executive intents map to hardened, predefined SQL templates, eliminating LLM hallucination risks for critical business queries.

---

## 3. Query Execution Guardrails

- **Result Row Limits:** All queries are automatically wrapped with `FETCH FIRST N ROWS ONLY` (Db2) or `LIMIT N` to prevent memory exhaustion and large-payload DoS attacks. Default limit is capped at `1000` rows.
- **Execution Timeouts:** Queries enforce strict execution timeouts (default: 30 seconds). Unresponsive queries are terminated.
- **Safe Error Shielding:** Internal database errors, connection strings, driver paths, and sensitive stack traces are logged internally and masked into sanitized, user-friendly error messages.

---

## 4. API & Network Security

- **Strict CORS Policy:** Restricted to approved local development origins (`http://localhost:5173`, `http://localhost:3000`) and explicit production domains via the `CORS_ORIGINS` environment variable.
- **Input Validation:** All API request bodies are strongly typed and validated using Pydantic schemas with length bounds and sanitization.
- **Credential Hygiene:**
  - Secrets and database credentials reside exclusively in environment variables (`.env`).
  - `.env` files are ignored by `.gitignore` and never committed to version control.
  - `.env.example` is provided with clean placeholder values only.
  - No frontend bundle contains database credentials or backend secrets.
