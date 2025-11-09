"""Cart repository for database operations"""
from typing import List, Dict
from .base import BaseRepository


class CartRepository(BaseRepository):
    """Repository for cart operations"""
    
    def __init__(self, db):
        super().__init__(db, "cart")
    
    async def find_by_session(self, session_id: str) -> List[Dict]:
        """Find cart items by session ID"""
        return await self.find_many({"session_id": session_id})
    
    async def get_by_session(self, session_id: str) -> List[Dict]:
        """Alias for find_by_session - used by routes"""
        return await self.find_by_session(session_id)
    
    async def find_item(self, product_id: str, session_id: str) -> Dict:
        """Find specific cart item"""
        return await self.find_one({"product_id": product_id, "session_id": session_id})
    
    async def get_by_product_and_session(self, product_id: str, session_id: str) -> Dict:
        """Alias for find_item - used by routes"""
        return await self.find_item(product_id, session_id)
    
    async def update_quantity(self, cart_item_id: str, new_quantity: int) -> Dict:
        """Update cart item quantity"""
        await self.update(cart_item_id, {"quantity": new_quantity})
        return await self.get_by_id(cart_item_id)
    
    async def clear_session_cart(self, session_id: str) -> int:
        """Clear all items from session cart"""
        return await self.delete_many({"session_id": session_id})
    
    async def clear_session(self, session_id: str) -> int:
        """Alias for clear_session_cart - used by routes"""
        return await self.clear_session_cart(session_id)

