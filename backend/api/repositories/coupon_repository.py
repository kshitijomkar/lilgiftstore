"""Coupon repository for database operations"""
from typing import List, Dict, Optional
from datetime import datetime, timezone
from .base import BaseRepository


class CouponRepository(BaseRepository):
    """Repository for coupon operations"""
    
    def __init__(self, db):
        super().__init__(db, "coupons")
        self.usage_collection = db["coupon_usage"]
    
    async def find_by_code(self, code: str) -> Optional[Dict]:
        """Find coupon by code"""
        return await self.find_one({"code": code.upper(), "is_active": True})
    
    async def get_active_coupons(self) -> List[Dict]:
        """Get all active coupons"""
        now = datetime.now(timezone.utc).isoformat()
        query = {
            "is_active": True,
            "valid_from": {"$lte": now},
            "valid_until": {"$gte": now}
        }
        return await self.find_many(query)
    
    async def increment_usage(self, coupon_id: str) -> bool:
        """Increment coupon usage count"""
        result = await self.collection.update_one(
            {"id": coupon_id},
            {"$inc": {"usage_count": 1}}
        )
        return result.matched_count > 0
    
    async def get_user_usage_count(self, coupon_id: str, user_id: str) -> int:
        """Get how many times user used a coupon"""
        return await self.usage_collection.count_documents({
            "coupon_id": coupon_id,
            "user_id": user_id
        })
    
    async def record_usage(self, usage_data: Dict):
        """Record coupon usage"""
        await self.usage_collection.insert_one(usage_data)
