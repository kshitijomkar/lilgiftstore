"""Wishlist schema models"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
import uuid


class WishlistItem(BaseModel):
    """Wishlist item schema"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
