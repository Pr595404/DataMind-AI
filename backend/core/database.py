"""
DataMind AI - Core Database Module
Manages IBM Db2 connections using ibm_db with a SQLite fallback for local/demo mode.
"""
import logging
import os
import re
import sqlite3
from typing import Any

logger = logging.getLogger(__name__)

# Attempt to import ibm_db — may fail if DLL is blocked or not installed
try:
    import ibm_db
    IBM_DB_AVAILABLE = True
except ImportError as e:
    IBM_DB_AVAILABLE = False
    ibm_db = None
    logger.warning("ibm_db not available: %s. Falling back to SQLite demo mode.", e)

from config import settings


class Db2Connection:
    """Manages IBM Db2 database connections with a SQLite fallback for local/demo mode."""

    def __init__(self):
        self._conn = None
        self._sqlite_conn = None
        self._sqlite_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "db",
            "datamind_demo.db",
        )
        self._ensure_sqlite_schema()

    def _sqlite_connect(self) -> sqlite3.Connection:
        os.makedirs(os.path.dirname(self._sqlite_path), exist_ok=True)
        if self._sqlite_conn is not None:
            try:
                self._sqlite_conn.execute("SELECT 1")
                return self._sqlite_conn
            except sqlite3.ProgrammingError:
                self._sqlite_conn.close()
                self._sqlite_conn = None

        conn = sqlite3.connect(self._sqlite_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        self._sqlite_conn = conn
        self._ensure_sqlite_schema()
        return conn

    def _ensure_sqlite_schema(self):
        if self._sqlite_conn is None:
            self._sqlite_connect()

        tables = self._sqlite_conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        ).fetchall()
        existing = {row[0].lower() for row in tables}

        if not existing:
            self._sqlite_conn.executescript(
                """
                CREATE TABLE customers (
                    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    phone TEXT,
                    city TEXT,
                    state TEXT,
                    segment TEXT DEFAULT 'Consumer',
                    created_at DATE DEFAULT CURRENT_DATE
                );

                CREATE TABLE products (
                    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    product_name TEXT NOT NULL,
                    category TEXT NOT NULL,
                    unit_price DECIMAL(10,2) NOT NULL,
                    stock_quantity INTEGER DEFAULT 0,
                    supplier TEXT,
                    created_at DATE DEFAULT CURRENT_DATE
                );

                CREATE TABLE orders (
                    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    customer_id INTEGER NOT NULL,
                    order_date DATE DEFAULT CURRENT_DATE,
                    status TEXT DEFAULT 'Pending',
                    total_amount DECIMAL(12,2),
                    shipping_city TEXT,
                    shipping_state TEXT,
                    FOREIGN KEY(customer_id) REFERENCES customers(customer_id)
                );

                CREATE TABLE order_items (
                    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_id INTEGER NOT NULL,
                    product_id INTEGER NOT NULL,
                    quantity INTEGER NOT NULL DEFAULT 1,
                    unit_price DECIMAL(10,2) NOT NULL,
                    line_total DECIMAL(12,2),
                    FOREIGN KEY(order_id) REFERENCES orders(order_id),
                    FOREIGN KEY(product_id) REFERENCES products(product_id)
                );

                CREATE TABLE transactions (
                    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_id INTEGER NOT NULL,
                    amount DECIMAL(12,2) NOT NULL,
                    payment_method TEXT NOT NULL,
                    status TEXT DEFAULT 'Completed',
                    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(order_id) REFERENCES orders(order_id)
                );

                CREATE TABLE query_history (
                    query_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_question TEXT NOT NULL,
                    generated_sql TEXT NOT NULL,
                    execution_status TEXT NOT NULL DEFAULT 'SUCCESS',
                    execution_duration_ms REAL DEFAULT 0.0,
                    row_count INTEGER DEFAULT 0,
                    error_message TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                """
            )
            self._load_sqlite_seed_data()

    def _load_sqlite_seed_data(self):
        seed_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "db", "seed_data.sql")
        if not os.path.exists(seed_path):
            return

        with open(seed_path, "r", encoding="utf-8") as file:
            sql = file.read()

        sql = re.sub(r"--.*?$", "", sql, flags=re.MULTILINE)
        statements = [
            stmt.strip() for stmt in sql.split(";") if stmt.strip() and "INSERT INTO" in stmt.upper()
        ]

        for stmt in statements:
            try:
                self._sqlite_conn.execute(stmt)
            except sqlite3.IntegrityError:
                continue

        self._sqlite_conn.commit()

    def _get_active_connection(self):
        if IBM_DB_AVAILABLE and self._conn is not None:
            return self._conn, "db2"
        if self._sqlite_conn is None:
            self._sqlite_connect()
        return self._sqlite_conn, "sqlite"

    def _normalize_sqlite_sql(self, sql: str) -> str:
        normalized = sql.strip().rstrip(";").strip()
        normalized = re.sub(r"FETCH FIRST\s+(\d+)\s+ROWS\s+ONLY", r"LIMIT \1", normalized, flags=re.I)
        normalized = normalized.replace("CURRENT SERVER", "'LOCALHOST'")
        normalized = normalized.replace("CURRENT TIMESTAMP", "CURRENT_TIMESTAMP")
        upper = normalized.upper()

        if "FROM SYSIBM.SYSDUMMY1" in upper:
            return "SELECT CURRENT_TIMESTAMP AS ts, 'LOCALHOST' AS server"
        return normalized

    def connect(self) -> bool:
        """Establish connection to IBM Db2 when available; otherwise use SQLite demo mode."""
        if IBM_DB_AVAILABLE:
            try:
                self._conn = ibm_db.connect(settings.db2_connection_string, "", "")
                logger.info("Successfully connected to IBM Db2 at %s:%s/%s",
                            settings.db2_host, settings.db2_port, settings.db2_database)
                return True
            except Exception as e:
                logger.warning("DB2 connection failed, using SQLite fallback: %s", e)
                self._conn = None

        self._sqlite_connect()
        logger.info("Using SQLite fallback database at %s", self._sqlite_path)
        return True

    def disconnect(self):
        """Close the active database connection."""
        if IBM_DB_AVAILABLE and self._conn:
            try:
                ibm_db.close(self._conn)
                logger.info("Disconnected from IBM Db2")
            except Exception as e:
                logger.warning("Error closing Db2 connection: %s", str(e))
            finally:
                self._conn = None

        if self._sqlite_conn is not None:
            try:
                self._sqlite_conn.close()
                logger.info("Closed SQLite fallback database")
            except Exception as e:
                logger.warning("Error closing SQLite connection: %s", str(e))
            finally:
                self._sqlite_conn = None

    @property
    def is_connected(self) -> bool:
        """Check if the connection is active."""
        if IBM_DB_AVAILABLE and self._conn is not None:
            try:
                return bool(ibm_db.active(self._conn))
            except Exception:
                return False
        return self._sqlite_conn is not None

    def ensure_connected(self) -> bool:
        """Reconnect if the connection was lost."""
        if not self.is_connected:
            return self.connect()
        return True

    def execute_query(self, sql: str, params: tuple = ()) -> dict[str, Any]:
        """Execute a SELECT query and return results."""
        if not self.ensure_connected():
            raise ConnectionError("Cannot connect to the database")

        if IBM_DB_AVAILABLE and self._conn is not None:
            try:
                if params:
                    stmt = ibm_db.prepare(self._conn, sql)
                    for i, param in enumerate(params):
                        ibm_db.bind_param(stmt, i + 1, param)
                    ibm_db.execute(stmt)
                else:
                    stmt = ibm_db.exec_immediate(self._conn, sql)

                columns = []
                num_cols = ibm_db.num_fields(stmt)
                for i in range(num_cols):
                    columns.append(ibm_db.field_name(stmt, i))

                rows = []
                row = ibm_db.fetch_assoc(stmt)
                while row:
                    clean_row = {}
                    for key, value in row.items():
                        if value is None:
                            clean_row[key] = None
                        elif isinstance(value, (int, float, str, bool)):
                            clean_row[key] = value
                        else:
                            clean_row[key] = str(value)
                    rows.append(clean_row)
                    row = ibm_db.fetch_assoc(stmt)

                return {"columns": columns, "rows": rows, "row_count": len(rows)}
            except Exception as e:
                logger.error("Query execution failed: %s | SQL: %s", str(e), sql)
                raise

        sqlite_conn = self._sqlite_conn or self._sqlite_connect()
        normalized_sql = self._normalize_sqlite_sql(sql)
        try:
            cursor = sqlite_conn.execute(normalized_sql, params)
            columns = [description[0] for description in cursor.description] if cursor.description else []
            rows = [dict(row) for row in cursor.fetchall()]
            return {"columns": columns, "rows": rows, "row_count": len(rows)}
        except Exception as e:
            logger.error("SQLite query execution failed: %s | SQL: %s", str(e), normalized_sql)
            raise

    def execute_ddl(self, sql: str) -> bool:
        """Execute a DDL statement (CREATE, ALTER, etc.)."""
        if not self.ensure_connected():
            raise ConnectionError("Cannot connect to the database")

        if IBM_DB_AVAILABLE and self._conn is not None:
            try:
                ibm_db.exec_immediate(self._conn, sql)
                logger.info("DDL executed successfully")
                return True
            except Exception as e:
                logger.error("DDL execution failed: %s", str(e))
                raise

        self._sqlite_conn.execute(sql)
        self._sqlite_conn.commit()
        return True

    def ping(self) -> dict[str, Any]:
        """Ping the database and return status info."""
        try:
            if not self.ensure_connected():
                return {"status": "disconnected", "error": "Cannot connect"}

            if IBM_DB_AVAILABLE and self._conn is not None:
                result = self.execute_query(
                    "SELECT CURRENT TIMESTAMP AS ts, CURRENT SERVER AS server FROM SYSIBM.SYSDUMMY1"
                )
                return {
                    "status": "connected",
                    "host": settings.db2_host,
                    "port": settings.db2_port,
                    "database": settings.db2_database,
                    "server_timestamp": (result["rows"][0].get("TS") or result["rows"][0].get("ts")) if result["rows"] else None,
                }

            self._sqlite_connect()
            result = self.execute_query("SELECT CURRENT_TIMESTAMP AS ts, 'LOCALHOST' AS server")
            return {
                "status": "connected",
                "host": "sqlite",
                "port": 0,
                "database": self._sqlite_path,
                "server_timestamp": (result["rows"][0].get("TS") or result["rows"][0].get("ts")) if result["rows"] else None,
                "mode": "sqlite-fallback",
            }
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def get_table_list(self) -> list[str]:
        """Get list of user tables in the schema."""
        if IBM_DB_AVAILABLE and self._conn is not None:
            sql = (
                "SELECT TABNAME FROM SYSCAT.TABLES "
                "WHERE TABSCHEMA = ? AND TYPE = 'T' "
                "ORDER BY TABNAME"
            )
            result = self.execute_query(sql, (settings.db2_schema.upper(),))
            return [row["TABNAME"] for row in result["rows"]]

        sqlite_conn = self._sqlite_conn or self._sqlite_connect()
        rows = sqlite_conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
        ).fetchall()
        return [row[0] for row in rows]

    def get_table_schema(self, table_name: str) -> list[dict]:
        """Get column details for a specific table."""
        if IBM_DB_AVAILABLE and self._conn is not None:
            sql = (
                "SELECT COLNAME, TYPENAME, LENGTH, SCALE, NULLS, DEFAULT, KEYSEQ "
                "FROM SYSCAT.COLUMNS "
                "WHERE TABSCHEMA = ? AND TABNAME = ? "
                "ORDER BY COLNO"
            )
            result = self.execute_query(sql, (settings.db2_schema.upper(), table_name.upper()))
            return result["rows"]

        sqlite_conn = self._sqlite_conn or self._sqlite_connect()
        rows = sqlite_conn.execute(f'PRAGMA table_info("{table_name}")').fetchall()
        return [
            {
                "COLNAME": row[1],
                "TYPENAME": row[2],
                "LENGTH": 255,
                "SCALE": 0,
                "NULLS": "Y" if row[3] == 0 else "N",
                "DEFAULT": row[4],
                "KEYSEQ": row[5],
            }
            for row in rows
        ]

    def get_full_schema(self) -> dict[str, list[dict]]:
        """Get schema for all user tables."""
        tables = self.get_table_list()
        schema = {}
        for table in tables:
            schema[table] = self.get_table_schema(table)
        return schema

    def log_query_history(
        self,
        user_question: str,
        generated_sql: str,
        execution_status: str,
        execution_duration_ms: float = 0.0,
        row_count: int = 0,
        error_message: str | None = None,
    ) -> bool:
        """Record query execution for audit analysis."""
        if not self.is_connected:
            return False

        if IBM_DB_AVAILABLE and self._conn is not None:
            sql = (
                "INSERT INTO query_history "
                "(user_question, generated_sql, execution_status, execution_duration_ms, row_count, error_message) "
                "VALUES (?, ?, ?, ?, ?, ?)"
            )
            try:
                clean_question = (user_question or "")[:1000]
                clean_sql = (generated_sql or "")[:4000]
                clean_status = (execution_status or "UNKNOWN")[:20]
                clean_error = (error_message or "")[:2000] if error_message else None

                stmt = ibm_db.prepare(self._conn, sql)
                ibm_db.bind_param(stmt, 1, clean_question)
                ibm_db.bind_param(stmt, 2, clean_sql)
                ibm_db.bind_param(stmt, 3, clean_status)
                ibm_db.bind_param(stmt, 4, float(execution_duration_ms))
                ibm_db.bind_param(stmt, 5, int(row_count))
                ibm_db.bind_param(stmt, 6, clean_error)
                ibm_db.execute(stmt)
                return True
            except Exception as e:
                logger.warning("Failed to record query history: %s", str(e))
                return False

        sqlite_conn = self._sqlite_conn or self._sqlite_connect()
        try:
            sqlite_conn.execute(
                "INSERT INTO query_history (user_question, generated_sql, execution_status, execution_duration_ms, row_count, error_message) VALUES (?, ?, ?, ?, ?, ?)",
                (
                    (user_question or "")[:1000],
                    (generated_sql or "")[:4000],
                    (execution_status or "UNKNOWN")[:20],
                    float(execution_duration_ms),
                    int(row_count),
                    (error_message or "")[:2000] if error_message else None,
                ),
            )
            sqlite_conn.commit()
            return True
        except Exception as e:
            logger.warning("Failed to record SQLite query history: %s", str(e))
            return False

    def get_query_history(self, limit: int = 50) -> list[dict]:
        """Retrieve recent query history entries."""
        if not self.is_connected:
            return []

        if IBM_DB_AVAILABLE and self._conn is not None:
            sql = (
                "SELECT query_id, user_question, generated_sql, execution_status, "
                "execution_duration_ms, row_count, error_message, created_at "
                "FROM query_history "
                "ORDER BY created_at DESC "
                f"FETCH FIRST {min(limit, 200)} ROWS ONLY"
            )
            try:
                result = self.execute_query(sql)
                return result.get("rows", [])
            except Exception as e:
                logger.warning("Failed to retrieve query history: %s", str(e))
                return []

        sqlite_conn = self._sqlite_conn or self._sqlite_connect()
        rows = sqlite_conn.execute(
            "SELECT query_id, user_question, generated_sql, execution_status, execution_duration_ms, row_count, error_message, created_at FROM query_history ORDER BY created_at DESC LIMIT ?",
            (min(limit, 200),),
        ).fetchall()
        return [dict(row) for row in rows]


# Singleton database instance
db = Db2Connection()
