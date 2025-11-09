"""Order service with business logic"""
from typing import List, Dict, Optional
from fastapi import HTTPException
from api.repositories import OrderRepository
from api.schemas import Order, OrderCreate
from api.utils.datetime_utils import serialize_document


class OrderService:
    """Order business logic"""
    
    def __init__(self, order_repo: OrderRepository):
        self.order_repo = order_repo
    
    async def create_order(self, order_data: OrderCreate, user_id: Optional[str] = None) -> Dict:
        """Create a new order"""
        order_dict = order_data.model_dump()
        order_dict['user_id'] = user_id
        
        order = Order(**order_dict)
        doc = serialize_document(order.model_dump())
        return await self.order_repo.create(doc)
    
    async def get_order(self, order_id: str) -> Dict:
        """Get order by ID"""
        order = await self.order_repo.find_by_id(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return order
    
    async def get_user_orders(self, user_id: str) -> List[Dict]:
        """Get all orders for a user"""
        return await self.order_repo.find_by_user(user_id)
    
    async def update_order_status(self, order_id: str, status: str) -> bool:
        """Update order status"""
        success = await self.order_repo.update(order_id, {"status": status})
        if not success:
            raise HTTPException(status_code=404, detail="Order not found")
        return True
    
    async def get_orders_by_status(self, status: Optional[str] = None, 
                                   limit: int = 100, skip: int = 0) -> Dict:
        """Get orders filtered by status"""
        if status:
            orders = await self.order_repo.find_by_status(status, limit=limit, skip=skip)
        else:
            orders = await self.order_repo.find_many(limit=limit, skip=skip, sort=[("created_at", -1)])
        
        total = await self.order_repo.count({"status": status} if status else {})
        
        return {
            "orders": orders,
            "total": total,
            "page": skip // limit + 1 if limit > 0 else 1,
            "per_page": limit
        }

