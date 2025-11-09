"""Review repository for database operations"""
from typing import List, Dict
from .base import BaseRepository


class ReviewRepository(BaseRepository):
    """Repository for review operations"""
    
    def __init__(self, db):
        super().__init__(db, "reviews")
    
    async def find_by_product(self, product_id: str, status: str = "approved",
                             limit: int = 20, skip: int = 0, sort_by: str = "recent") -> List[Dict]:
        """Find reviews for a product"""
        query = {"product_id": product_id, "status": status}
        
        sort_options = {
            "recent": [("created_at", -1)],
            "helpful": [("helpful_count", -1)],
            "rating_high": [("rating", -1)],
            "rating_low": [("rating", 1)]
        }
        
        sort = sort_options.get(sort_by, [("created_at", -1)])
        return await self.find_many(query, limit=limit, skip=skip, sort=sort)
    
    async def find_by_user_and_product(self, user_id: str, product_id: str) -> Dict:
        """Check if user reviewed a product"""
        return await self.find_one({"user_id": user_id, "product_id": product_id})
    
    async def get_product_rating_stats(self, product_id: str) -> Dict:
        """Get rating statistics for a product"""
        pipeline = [
            {"$match": {"product_id": product_id, "status": "approved"}},
            {
                "$group": {
                    "_id": None,
                    "avg_rating": {"$avg": "$rating"},
                    "total_reviews": {"$sum": 1}
                }
            }
        ]
        result = await self.aggregate(pipeline)
        return result[0] if result else {"avg_rating": 0, "total_reviews": 0}

