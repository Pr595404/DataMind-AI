"""
DataMind AI - Configuration
Loads settings from .env file using pydantic-settings.
"""
import os
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # IBM Db2 Connection
    db2_host: str = Field(default="localhost", alias="DB2_HOST")
    db2_port: int = Field(default=50000, alias="DB2_PORT")
    db2_database: str = Field(default="DATAMIND", alias="DB2_DATABASE")
    db2_user: str = Field(default="db2inst1", alias="DB2_USER")
    db2_password: str = Field(default="", alias="DB2_PASSWORD")
    db2_schema: str = Field(default="DB2INST1", alias="DB2_SCHEMA")

    # Ollama (Local AI)
    ollama_base_url: str = Field(default="http://localhost:11434", alias="OLLAMA_BASE_URL")
    ollama_model: str = Field(default="mistral", alias="OLLAMA_MODEL")

    # FastAPI
    app_host: str = Field(default="0.0.0.0", alias="APP_HOST")
    app_port: int = Field(default=8000, alias="APP_PORT")
    app_debug: bool = Field(default=True, alias="APP_DEBUG")
    cors_origins: str = Field(default="http://localhost:5173,http://localhost:3000,http://localhost:4173,http://127.0.0.1:5173,http://127.0.0.1:3000", alias="CORS_ORIGINS")

    # Query Safety
    max_query_rows: int = Field(default=1000, alias="MAX_QUERY_ROWS")
    query_timeout_seconds: int = Field(default=30, alias="QUERY_TIMEOUT_SECONDS")

    @property
    def db2_connection_string(self) -> str:
        """Build the ibm_db connection string."""
        return (
            f"DATABASE={self.db2_database};"
            f"HOSTNAME={self.db2_host};"
            f"PORT={self.db2_port};"
            f"PROTOCOL=TCPIP;"
            f"UID={self.db2_user};"
            f"PWD={self.db2_password};"
        )

    @property
    def db2_sqlalchemy_url(self) -> str:
        """Build the SQLAlchemy URL for Db2."""
        return (
            f"db2+ibm_db://{self.db2_user}:{self.db2_password}"
            f"@{self.db2_host}:{self.db2_port}/{self.db2_database}"
        )

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


# Singleton instance
settings = Settings()
