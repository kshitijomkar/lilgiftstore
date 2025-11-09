"""Product repository for database operations"""
from typing import List, Dict, Optional
from .base import BaseRepository


class ProductRepository(BaseRepository):
    """Repository for product operations"""
    
    def __init__(self, db):
        super().__init__(db, "products")
    
    async def search_products(self, query: str, category: Optional[str] = None,
                            min_price: Optional[float] = None, max_price: Optional[float] = None,
                            tags: Optional[List[str]] = None, limit: int = 20, skip: int = 0,
                            sort_by: str = "created_at", order: str = "desc") -> List[Dict]:
        """Advanced product search with filters"""
        filter_query = {}
        
        # Text search
        if query:
            filter_query["$or"] = [
                {"name": {"$regex": query, "$options": "i"}},
                {"description": {"$regex": query, "$options": "i"}},
                {"tags": {"$regex": query, "$options": "i"}}
            ]
        
        # Category filter
        if category:
            filter_query["category"] = category
        
        # Price range
        if min_price is not None or max_price is not None:
            filter_query["price"] = {}
            if min_price is not None:
                filter_query["price"]["$gte"] = min_price
            if max_price is not None:
                filter_query["price"]["$lte"] = max_price
        
        # Tags filter
        if tags:
            filter_query["tags"] = {"$in": tags}
        
        # Sort
        sort_order = -1 if order == "desc" else 1
        sort_field = sort_by if sort_by in ["price", "created_at", "name", "average_rating"] else "created_at"
        
        return await self.find_many(filter_query, limit=limit, skip=skip, sort=[(sort_field, sort_order)])
    
    async def get_low_stock_products(self) -> List[Dict]:
        """Get products with low stock"""
        pipeline = [
            {
                "$match": {
                    "$expr": {
                        "$lte": ["$stock_quantity", "$low_stock_threshold"]
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "id": 1,
                    "name": 1,
                    "stock_quantity": 1,
                    "low_stock_threshold": 1,
                    "category": 1
                }
            }
        ]
        return await self.aggregate(pipeline)
    
    async def update_rating(self, product_id: str, avg_rating: float, total_reviews: int):
        """Update product rating"""
        await self.update(product_id, {
            "average_rating": round(avg_rating, 1),
            "total_reviews": total_reviews
        })
    
    async def decrease_stock(self, product_id: str, quantity: int) -> bool:
        """Decrease product stock"""
        product = await self.find_by_id(product_id)
        if not product:
            return False
        
        new_quantity = max(0, product.get("stock_quantity", 100) - quantity)
        await self.update(product_id, {"stock_quantity": new_quantity})
        return True
