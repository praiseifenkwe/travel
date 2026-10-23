import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.socket_manager import sio
from app.models.database import engine, Base
from app.api import chat, documents, applications, staff, flights

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Native Visa & Relocation Operating System API",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development allow all for smooth dev A & B communication
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Mount REST API Routers
app.include_router(chat.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(applications.router, prefix="/api")
app.include_router(staff.router, prefix="/api")
app.include_router(flights.router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    # Automatically create database tables on startup if PostgreSQL / SQLite is ready
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("? Database tables verified/created successfully.")
    except Exception as e:
        print(f"?? Notice: Database auto-migration deferred or waiting for connection: {e}")

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT
    }

# Combine FastAPI ASGI with python-socketio AsyncServer
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)
