"""
DataMind AI - FastAPI Application Entry Point
"""
import sys
import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure the backend directory is on the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import settings
from core.database import db
from api.routes.health import router as health_router
from api.routes.schema import router as schema_router
from api.routes.query import router as query_router
from api.routes.dashboard import router as dashboard_router
from api.routes.analytics import router as analytics_router
from api.middleware.error_handler import global_exception_handler

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.app_debug else logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("datamind")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    logger.info("=" * 60)
    logger.info("  DataMind AI - Starting up")
    logger.info("=" * 60)

    # Attempt database connection
    if db.connect():
        logger.info("✅ IBM Db2 connection established")
    else:
        logger.warning("⚠️  IBM Db2 connection failed - running in degraded mode")
        logger.warning("   Make sure Db2 is running and .env is configured")

    yield

    # Shutdown
    logger.info("Shutting down DataMind AI...")
    db.disconnect()
    logger.info("Goodbye!")


# Create the FastAPI app
app = FastAPI(
    title="DataMind AI",
    description=(
        "AI-Powered Business Intelligence Platform — "
        "Ask business questions in natural language, get answers from IBM Db2."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow React frontend
allowed_origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles

# Global error handler
app.add_exception_handler(Exception, global_exception_handler)

# Register routers
app.include_router(health_router)
app.include_router(schema_router)
app.include_router(query_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)


@app.get("/api/info", tags=["root"])
async def root_info():
    """API info endpoint."""
    return {
        "name": "DataMind AI",
        "version": "0.1.0",
        "description": "AI-Powered Business Intelligence Platform — IBM Db2 + LangChain",
        "docs": "/docs",
        "health": "/api/health",
    }


# Mount production frontend build if available
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
else:
    @app.get("/", tags=["root"])
    async def root():
        return await root_info()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.app_debug,
    )
