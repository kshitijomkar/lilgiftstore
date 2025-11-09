"""Order repository for database operations"""
from typing import List, Dict, Optional
from datetime import datetime, timedelta, timezone
from .base import BaseRepository


class OrderRepository(BaseRepository):
    """Repository for order operations"""
    
    def __init__(self, db):
        super().__init__(db, "orders")
    
    async def find_by_user(self, user_id: str, limit: int = 100) -> List[Dict]:
        """Find orders by user ID"""
        return await self.find_many({"user_id": user_id}, limit=limit, sort=[("created_at", -1)])
    
    async def get_user_orders(self, user_id: str, limit: int = 100) -> List[Dict]:
        """Alias for find_by_user - used by routes"""
        return await self.find_by_user(user_id, limit)
    
    async def find_by_session(self, session_id: str) -> List[Dict]:
        """Find orders by session ID"""
        return await self.find_many({"session_id": session_id})
    
    async def find_by_status(self, status: str, limit: int = 100, skip: int = 0) -> List[Dict]:
        """Find orders by status"""
        return await self.find_many({"status": status}, limit=limit, skip=skip, sort=[("created_at", -1)])
    
    async def get_sales_analytics(self, days: int = 30) -> List[Dict]:
        """Get sales analytics for last N days"""
        start_date = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
        
        pipeline = [
            {"$match": {"created_at": {"$gte": start_date}}},
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": {"$toDate": "$created_at"}
                        }
                    },
                    "total_sales": {"$sum": "$total_amount"},
                    "order_count": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}}
        ]
        
        return await self.aggregate(pipeline)
    
    async def add_status_history(self, order_id: str, status: str) -> bool:
        """Add status change to order history"""
        from api.utils.datetime_utils import serialize_document
        import uuid
        
        history_entry = serialize_document({
            "id": str(uuid.uuid4()),
            "order_id": order_id,
            "status": status,
            "timestamp": datetime.now(timezone.utc)
        })
        
        try:
            await self.db["order_status_history"].insert_one(history_entry)
            return True
        except Exception as e:
            print(f"Error adding status history: {e}")
            return False
    
    async def get_status_history(self, order_id: str) -> List[Dict]:
        """Get status change history for an order"""
        from api.utils.datetime_utils import deserialize_documents
        
        try:
            history = await self.db["order_status_history"].find(
                {"order_id": order_id},
                {"_id": 0}
            ).sort("timestamp", 1).to_list(100)
            
            return deserialize_documents(history)
        except Exception as e:
            print(f"Error getting status history: {e}")
            return []
