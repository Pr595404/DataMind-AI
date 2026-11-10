"""
DataMind AI - Health Check Route
"""
from fastapi import APIRouter
import httpx
import logging

from core.database import db
from config import settings
from models.response import HealthResponse

router = APIRouter(prefix="/api", tags=["health"])
logger = logging.getLogger(__name__)


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Check the health of all services:
    - IBM Db2 database connectivity
    - Ollama AI service availability
    """
    # Check Db2
    db_status = db.ping()

    # Check Ollama
    ai_status = {"status": "unknown"}
    try:
        fast_timeout = httpx.Timeout(timeout=2.0, connect=0.5)
        async with httpx.AsyncClient(timeout=fast_timeout) as client:
            response = await client.get(f"{settings.ollama_base_url}/api/tags")
            if response.status_code == 200:
                models = response.json().get("models", [])
                model_names = [m.get("name", "") for m in models]
                ai_status = {
                    "status": "connected",
                    "url": settings.ollama_base_url,
                    "available_models": model_names,
                    "selected_model": settings.ollama_model,
                }
            else:
                ai_status = {"status": "error", "error": f"HTTP {response.status_code}"}
    except (httpx.ConnectError, httpx.ConnectTimeout, httpx.RequestError):
        ai_status = {
            "status": "standby",
            "url": settings.ollama_base_url,
            "selected_model": settings.ollama_model,
            "error": "Ollama local daemon offline (Intelligent Rule-Based NL-to-SQL active)",
        }
    except Exception as e:
        ai_status = {
            "status": "standby",
            "url": settings.ollama_base_url,
            "selected_model": settings.ollama_model,
            "error": str(e) or "LLM offline (Intelligent Intent matching active)",
        }

    # Overall status
    db_connected = db_status.get("status") == "connected"
    ai_connected = ai_status.get("status") == "connected"

    if db_connected and ai_connected:
        overall = "healthy"
    elif db_connected or ai_connected:
        overall = "degraded"
    else:
        overall = "degraded"

    return HealthResponse(
        status=overall,
        database=db_status,
        ai_service=ai_status,
    )
