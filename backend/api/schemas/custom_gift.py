"""Custom gift request schema models"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone
import uuid


class CustomGiftCreate(BaseModel):
    """Schema for submitting a custom gift request"""
    name: str
    email: str
    phone: Optional[str] = None
    occasion: str
    description: str
    budget: Optional[str] = None


class CustomGiftRequest(BaseModel):
    """Complete custom gift request schema"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    occasion: str
    description: str
    budget: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
