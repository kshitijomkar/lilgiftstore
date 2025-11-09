"""Coupon schema models"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone
import uuid


class CouponCreate(BaseModel):
    """Schema for creating a coupon"""
    code: str
    type: str  # percentage, fixed, free_shipping
    value: float
    min_order_value: float = 0
    max_discount: Optional[float] = None
    usage_limit: Optional[int] = None
    user_usage_limit: int = 1
    valid_from: datetime
    valid_until: datetime


class CouponValidate(BaseModel):
    """Schema for validating a coupon"""
    code: str
    order_value: float


class Coupon(BaseModel):
    """Complete coupon schema"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    type: str
    value: float
    min_order_value: float = 0
    max_discount: Optional[float] = None
    usage_limit: Optional[int] = None
    usage_count: int = 0
    user_usage_limit: int = 1
    valid_from: datetime
    valid_until: datetime
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CouponUsage(BaseModel):
    """Coupon usage tracking schema"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    coupon_id: str
    user_id: str
    order_id: str
    discount_amount: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

