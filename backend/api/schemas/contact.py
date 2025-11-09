"""Contact schema models"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
import uuid


class ContactCreate(BaseModel):
    """Schema for submitting a contact message"""
    name: str
    email: str
    message: str


class ContactRequest(BaseModel):
    """Complete contact request schema"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
