# DataMind AI - API Routes
from api.routes.health import router as health_router
from api.routes.schema import router as schema_router
from api.routes.query import router as query_router
from api.routes.dashboard import router as dashboard_router

__all__ = ["health_router", "schema_router", "query_router", "dashboard_router"]
