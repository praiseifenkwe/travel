import os
import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, 
    DateTime, ForeignKey, JSON
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.core.config import settings

Base = declarative_base()

# Async Engine Setup
DATABASE_URL = settings.DATABASE_URL
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    client_name = Column(String(255), nullable=False)
    client_email = Column(String(255), nullable=True)
    client_phone = Column(String(50), nullable=True)
    visa_type = Column(String(50), nullable=False, default="uk_skilled_worker")
    destination = Column(String(100), nullable=False, default="United Kingdom")
    employer = Column(String(255), nullable=True)
    travel_timeline = Column(String(100), nullable=True)
    stage = Column(String(50), nullable=False, default="intake")
    compliance_passed = Column(Boolean, default=False)
    compliance_summary = Column(JSON, default=dict)
    extracted_profile = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    documents = relationship("Document", back_populates="application", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="application", cascade="all, delete-orphan")
    staff_actions = relationship("StaffAction", back_populates="application", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    doc_type = Column(String(50), nullable=False) # passport, cos, tb_test, bank_statement
    file_path = Column(String(500), nullable=False)
    original_filename = Column(String(255), nullable=True)
    mime_type = Column(String(50), nullable=True)
    file_size_bytes = Column(Integer, nullable=True)
    status = Column(String(30), nullable=False, default="pending") # pending, processing, passed, flagged, failed
    extracted_data = Column(JSON, default=dict)
    ai_confidence = Column(Float, nullable=True)
    issues = Column(JSON, default=list)
    processed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    application = relationship("Application", back_populates="documents")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(20), nullable=False) # user, assistant, system
    content = Column(Text, nullable=False)
    message_type = Column(String(30), default="text")
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    application = relationship("Application", back_populates="chat_messages")

class StaffAction(Base):
    __tablename__ = "staff_actions"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    staff_id = Column(String(36), nullable=True)
    action_type = Column(String(50), nullable=False) # approve_query, override_issue, authorize_submit
    target_document_id = Column(String(36), nullable=True)
    target_issue_type = Column(String(50), nullable=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    application = relationship("Application", back_populates="staff_actions")
