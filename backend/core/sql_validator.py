"""
DataMind AI - SQL Validator
Ensures only safe, read-only queries are executed against Db2.
"""
import re
import logging

logger = logging.getLogger(__name__)

# Dangerous SQL keywords that indicate write/modify operations
FORBIDDEN_KEYWORDS = [
    r'\bINSERT\b',
    r'\bUPDATE\b',
    r'\bDELETE\b',
    r'\bDROP\b',
    r'\bALTER\b',
    r'\bCREATE\b',
    r'\bTRUNCATE\b',
    r'\bGRANT\b',
    r'\bREVOKE\b',
    r'\bEXECUTE\b',
    r'\bEXEC\b',
    r'\bCALL\b',
    r'\bMERGE\b',
    r'\bRENAME\b',
    r'\bCOMMENT\b',
    r'\bSET\b(?!\s+)',  # SET as standalone (not inside OFFSET or column alias)
]

# Patterns that could indicate SQL injection or dangerous constructs
DANGEROUS_PATTERNS = [
    r';\s*\w',             # Multiple statements (semicolon followed by keyword)
    r'--',                 # SQL comments (could hide injected code)
    r'/\*',                # Block comments
    r'\bxp_\w+',           # Extended stored procedures
    r'\bsp_\w+',           # System stored procedures
    r'\bDBMS_\w+',         # Oracle-style packages
    r'\bUTL_\w+',          # Oracle-style utilities
    r'\bSYSPROC\.',        # Db2 system procedures
    r'\bSYSFUN\.',         # Db2 system functions (write-capable ones)
    r'\bINTO\s+\w+',       # SELECT INTO (creates tables/variables)
]


class SQLValidationResult:
    """Result of SQL validation."""

    def __init__(self, is_safe: bool, sql: str, reason: str = ""):
        self.is_safe = is_safe
        self.sql = sql
        self.reason = reason

    def __bool__(self):
        return self.is_safe


def validate_sql(sql: str) -> SQLValidationResult:
    """
    Validate that a SQL statement is safe for execution.

    Rules:
    1. Must start with SELECT (after whitespace trimming).
    2. Must not contain any forbidden keywords.
    3. Must not contain dangerous patterns.
    4. Must be a single statement (no semicolons mid-query).

    Args:
        sql: The SQL string to validate.

    Returns:
        SQLValidationResult with is_safe flag and reason.
    """
    if not sql or not sql.strip():
        return SQLValidationResult(False, sql, "Empty SQL statement")

    # Normalize whitespace
    cleaned = sql.strip()

    # Remove trailing semicolon (Db2 doesn't need it in ibm_db)
    if cleaned.endswith(';'):
        cleaned = cleaned[:-1].strip()

    # Rule 1: Must start with SELECT or WITH (for CTEs)
    upper_sql = cleaned.upper()
    if not (upper_sql.startswith('SELECT') or upper_sql.startswith('WITH')):
        return SQLValidationResult(
            False, cleaned,
            "Query must start with SELECT or WITH (CTE). "
            f"Found: '{cleaned[:20]}...'"
        )

    # Rule 2: Check for forbidden keywords
    for pattern in FORBIDDEN_KEYWORDS:
        match = re.search(pattern, upper_sql)
        if match:
            keyword = match.group(0)
            return SQLValidationResult(
                False, cleaned,
                f"Forbidden keyword detected: {keyword}. "
                "Only SELECT queries are allowed."
            )

    # Rule 3: Check for dangerous patterns
    for pattern in DANGEROUS_PATTERNS:
        match = re.search(pattern, upper_sql)
        if match:
            return SQLValidationResult(
                False, cleaned,
                f"Potentially dangerous pattern detected: '{match.group(0)}'. "
                "Query rejected for safety."
            )

    logger.info("SQL validation passed: %s", cleaned[:100])
    return SQLValidationResult(True, cleaned)


def sanitize_and_limit(sql: str, max_rows: int = 100) -> str:
    """
    Add row limit to SQL if not already present.
    Uses Db2 syntax: FETCH FIRST n ROWS ONLY.
    """
    upper_sql = sql.upper().strip()

    # Don't add limit if already present
    if 'FETCH FIRST' in upper_sql:
        return sql

    # Add Db2-style row limit
    return f"{sql.rstrip().rstrip(';')} FETCH FIRST {max_rows} ROWS ONLY"
