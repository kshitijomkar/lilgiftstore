"""Cart schema models"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone
import uuid


class CartItemCreate(BaseModel):
    """Schema for adding item to cart"""
    product_id: str
    quantity: int
    session_id: str
    user_id: Optional[str] = None


class CartItem(BaseModel):
    """Complete cart item schema"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    quantity: int
    session_id: str
    user_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

