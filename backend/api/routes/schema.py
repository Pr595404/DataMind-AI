"""
DataMind AI - Schema Introspection Route
"""
from fastapi import APIRouter, HTTPException
import logging

from core.database import db
from models.response import SchemaResponse, SchemaTableResponse

router = APIRouter(prefix="/api", tags=["schema"])
logger = logging.getLogger(__name__)


@router.get("/schema", response_model=SchemaResponse)
async def get_full_schema():
    """Return schema metadata for all tables in the database."""
    try:
        tables = db.get_table_list()
        schema_details = db.get_full_schema()
        return SchemaResponse(tables=tables, schema_details=schema_details)
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=f"Database unavailable: {e}")
    except Exception as e:
        logger.error("Schema introspection failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/schema/{table_name}", response_model=SchemaTableResponse)
async def get_table_schema(table_name: str):
    """Return column metadata for a specific table."""
    try:
        columns = db.get_table_schema(table_name)
        if not columns:
            raise HTTPException(
                status_code=404,
                detail=f"Table '{table_name}' not found in schema '{db._conn and 'connected' or 'disconnected'}'",
            )
        return SchemaTableResponse(table_name=table_name.upper(), columns=columns)
    except HTTPException:
        raise
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=f"Database unavailable: {e}")
    except Exception as e:
        logger.error("Table schema fetch failed for %s: %s", table_name, e)
        raise HTTPException(status_code=500, detail=str(e))
