"""Payment transaction schema models"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Dict, Optional
from datetime import datetime, timezone
import uuid


class PaymentTransaction(BaseModel):
    """Payment transaction schema"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    checkout_session_id: str
    amount: float
    currency: str
    metadata: Dict
    payment_status: str = "pending"
    status: str = "initiated"
    order_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
