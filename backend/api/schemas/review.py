"""Review schema models"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
import uuid


class ReviewCreate(BaseModel):
    """Schema for creating a product review"""
    product_id: str
    rating: int  # 1-5
    title: str
    review_text: str


class Review(BaseModel):
    """Complete review schema"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    user_id: str
    user_name: str
    rating: int
    title: str
    review_text: str
    verified_purchase: bool = False
    helpful_count: int = 0
    status: str = "approved"  # approved, pending, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
