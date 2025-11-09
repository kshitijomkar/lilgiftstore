"""Product schema models"""
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid


class ProductBase(BaseModel):
    """Base product schema"""
    name: str
    price: float
    category: str
    images: List[str]
    description: str
    tags: List[str] = []


class ProductCreate(ProductBase):
    """Schema for creating a new product"""
    pass


class ProductUpdate(BaseModel):
    """Schema for updating a product"""
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    in_stock: Optional[bool] = None
    stock_quantity: Optional[int] = None
    low_stock_threshold: Optional[int] = None


class Product(ProductBase):
    """Complete product schema"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    in_stock: bool = True
    stock_quantity: int = 100
    low_stock_threshold: int = 10
    average_rating: float = 0.0
    total_reviews: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
