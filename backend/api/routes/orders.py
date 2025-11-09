"""Order Routes"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from api.schemas import Order, OrderCreate
from api.repositories.order_repository import OrderRepository
from api.dependencies import get_order_repository, get_current_user, optional_user

router = APIRouter(prefix="/orders")


@router.post("", response_model=Order)
async def create_order(
    order: OrderCreate,
    user: Optional[dict] = Depends(optional_user),
    order_repo: OrderRepository = Depends(get_order_repository)
):
    """Create new order"""
    order_data = order.model_dump()
    order_data["user_id"] = user["id"] if user else None
    
    # Create full Order object with all required fields
    full_order = Order(**order_data)
    created_order = await order_repo.create(full_order.model_dump())
    return created_order


@router.get("/{order_id}", response_model=Order)
async def get_order(
    order_id: str,
    order_repo: OrderRepository = Depends(get_order_repository)
):
    """Get order by ID"""
    order = await order_repo.get_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.get("/{order_id}/timeline")
async def get_order_timeline(
    order_id: str,
    order_repo: OrderRepository = Depends(get_order_repository)
):
    """Get order status timeline"""
    order = await order_repo.get_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    timeline = await order_repo.get_status_history(order_id)
    
    return {
        "timeline": timeline,
        "current_status": order.get("status", "pending")
    }


# Track order route (at root level /api/track/{order_id})
from fastapi import APIRouter as _APIRouter
track_router = _APIRouter()

@track_router.get("/track/{order_id}")
async def track_order(
    order_id: str,
    order_repo: OrderRepository = Depends(get_order_repository)
):
    """Public order tracking"""
    order = await order_repo.get_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    timeline = await order_repo.get_status_history(order_id)
    
    return {
        "order_id": order_id,
        "status": order.get("status", "pending"),
        "created_at": order.get("created_at"),
        "total_amount": order.get("total_amount"),
        "timeline": timeline
    }
