"""User schema models"""
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime, timezone
import uuid


class UserBase(BaseModel):
    """Base user schema"""
    name: str
    email: EmailStr


class UserCreate(UserBase):
    """Schema for user registration"""
    password: str


class LoginRequest(BaseModel):
    """Schema for login request"""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    name: Optional[str] = None
    phone: Optional[str] = None


class User(UserBase):
    """Complete user schema"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    password: str
    role: str = "customer"  # customer or admin
    phone: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
