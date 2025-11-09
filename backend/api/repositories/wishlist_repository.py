"""Wishlist repository for database operations"""
from typing import List, Dict
from .base import BaseRepository


class WishlistRepository(BaseRepository):
    """Repository for wishlist operations"""
    
    def __init__(self, db):
        super().__init__(db, "wishlist")
    
    async def find_by_user(self, user_id: str) -> List[Dict]:
        """Find wishlist items for a user"""
        return await self.find_many({"user_id": user_id}, sort=[("created_at", -1)])
    
    async def get_user_wishlist(self, user_id: str) -> List[Dict]:
        """Alias for find_by_user - used by routes"""
        return await self.find_by_user(user_id)
    
    async def find_item(self, user_id: str, product_id: str) -> Dict:
        """Check if product is in user's wishlist"""
        return await self.find_one({"user_id": user_id, "product_id": product_id})
    
    async def get_user_product_wishlist(self, user_id: str, product_id: str) -> Dict:
        """Alias for find_item - used by routes"""
        return await self.find_item(user_id, product_id)
    
    async def remove_item(self, user_id: str, product_id: str) -> bool:
        """Remove product from wishlist"""
        result = await self.collection.delete_one({"user_id": user_id, "product_id": product_id})
        return result.deleted_count > 0
    
    async def delete_user_product(self, user_id: str, product_id: str) -> bool:
        """Alias for remove_item - used by routes"""
        return await self.remove_item(user_id, product_id)
