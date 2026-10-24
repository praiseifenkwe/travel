import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "TravelForge"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"
    CORS_ORIGIN: str = "http://localhost:5173"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://travelforge:travelforge@localhost:5432/travelforge"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # AI Providers
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GOOGLE_AI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    GROK_LLM_API_KEY: Optional[str] = None

    # Model Configuration
    PRIMARY_LLM_PROVIDER: str = "groq"  # "groq" primary with gemini fallback
    GEMINI_MODEL: str = "gemini-1.5-flash"
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    FALLBACK_GROQ_MODEL: str = "llama-3.1-8b-instant"

    @property
    def get_gemini_key(self) -> Optional[str]:
        return self.GEMINI_API_KEY or self.GOOGLE_AI_API_KEY

    @property
    def get_groq_key(self) -> Optional[str]:
        return self.GROQ_API_KEY or self.GROK_LLM_API_KEY

    # Embeddings
    EMBEDDING_MODEL: str = "models/gemini-embedding-001"
    EMBEDDING_DIMENSIONS: int = 3072

    # ChromaDB
    CHROMA_PERSIST_PATH: str = "./chroma_storage"
    CHROMA_COLLECTION_NAME: str = "business_knowledge"
    RAG_DISTANCE_THRESHOLD: float = 0.55  # Chroma cosine distance; lower is a closer match

    # LLM
    CHAT_MODEL: str = "gemini-1.5-flash"
    AUDIT_MODEL: str = "gemini-1.5-flash"
    RAG_TOP_K: int = 5                  # How many chunks to retrieve per query

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
