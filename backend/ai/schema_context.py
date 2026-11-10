"""
DataMind AI - Schema Context Builder
Builds schema context strings for LLM prompts.
(Phase 2 implementation)
"""
from core.database import db
import logging

logger = logging.getLogger(__name__)


def build_schema_context() -> str:
    """
    Build a text representation of the database schema
    for inclusion in LLM prompts.

    Returns DDL-like description of all tables and their columns.
    """
    try:
        schema = db.get_full_schema()
    except Exception as e:
        logger.error("Failed to build schema context: %s", e)
        return "(Schema unavailable - database not connected)"

    if not schema:
        return "(No tables found in schema)"

    lines = ["-- Database Schema for DATAMIND\n"]

    for table_name, columns in schema.items():
        lines.append(f"TABLE {table_name} (")
        col_lines = []
        for col in columns:
            col_name = col.get("COLNAME", "")
            col_type = col.get("TYPENAME", "")
            length = col.get("LENGTH", "")
            nullable = "NULL" if col.get("NULLS", "Y") == "Y" else "NOT NULL"
            key = " PRIMARY KEY" if col.get("KEYSEQ") else ""

            if col_type in ("VARCHAR", "CHARACTER"):
                type_str = f"{col_type}({length})"
            elif col_type == "DECIMAL":
                scale = col.get("SCALE", 0)
                type_str = f"DECIMAL({length},{scale})"
            else:
                type_str = col_type

            col_lines.append(f"  {col_name} {type_str} {nullable}{key}")

        lines.append(",\n".join(col_lines))
        lines.append(");\n")

    return "\n".join(lines)
