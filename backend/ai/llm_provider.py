"""
DataMind AI - Ollama LLM Provider
Wrapper around local Ollama for LangChain integration.
(Phase 2 implementation)
"""
import httpx
import logging

from config import settings

logger = logging.getLogger(__name__)


async def check_ollama_status() -> dict:
    """Check if Ollama is running and which models are available."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{settings.ollama_base_url}/api/tags")
            if response.status_code == 200:
                models = response.json().get("models", [])
                model_names = [m.get("name", "") for m in models]
                return {
                    "available": True,
                    "models": model_names,
                    "selected": settings.ollama_model,
                    "has_selected_model": settings.ollama_model in model_names
                                         or any(settings.ollama_model in m for m in model_names),
                }
            return {"available": False, "error": f"HTTP {response.status_code}"}
    except httpx.ConnectError:
        return {"available": False, "error": "Ollama not running"}
    except Exception as e:
        return {"available": False, "error": str(e)}


# LangChain integration will be added in Phase 2:
# from langchain_ollama import ChatOllama
# llm = ChatOllama(model=settings.ollama_model, base_url=settings.ollama_base_url, temperature=0)
