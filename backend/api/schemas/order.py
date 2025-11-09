"""Order schema models"""
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Optional
from datetime import datetime, timezone
import uuid


class OrderCreate(BaseModel):
    """Schema for creating a new order"""
    session_id: str
    items: List[Dict]
    total_amount: float
    customer_email: Optional[str] = None
    customer_name: Optional[str] = None
    payment_method: str = "stripe"  # stripe or cod
    address: Optional[Dict] = None


class OrderStatusUpdate(BaseModel):
    """Schema for updating order status"""
    status: str


class Order(BaseModel):
    """Complete order schema"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    items: List[Dict]
    total_amount: float
    customer_email: Optional[str] = None
    customer_name: Optional[str] = None
    user_id: Optional[str] = None
    payment_method: str = "stripe"
    address: Optional[Dict] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

