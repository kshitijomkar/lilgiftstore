"""Admin Routes"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, Dict
from datetime import datetime, timezone, timedelta
from api.schemas import (
    ProductCreate, OrderStatusUpdate
)
from api.repositories import (
    ProductRepository, OrderRepository, UserRepository,
    ReviewRepository, CouponRepository
)
from api.dependencies import (
    get_product_repository, get_order_repository, get_user_repository,
    get_review_repository, get_coupon_repository, require_admin
)
from api.schemas.coupon import CouponCreate
from api.config.database import db_manager
from api.utils.datetime_utils import serialize_document

router = APIRouter(prefix="/admin")


# Dashboard
@router.get("/dashboard")
async def admin_dashboard(
    admin: dict = Depends(require_admin),
    product_repo: ProductRepository = Depends(get_product_repository),
    order_repo: OrderRepository = Depends(get_order_repository),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Get admin dashboard analytics"""
    # Basic counts
    total_products = await product_repo.count({})
    total_orders = await order_repo.count({})
    total_users = await user_repo.count({})
    
    # Total sales
    all_orders = await order_repo.find({})
    total_sales = sum([o.get("total_amount", 0) for o in all_orders])
    
    # Recent orders
    recent_orders = await order_repo.find(
        {}, "created_at", -1, 0, 5
    )
    
    # Orders by status
    pending_orders = await order_repo.count({"status": "pending"})
    completed_orders = await order_repo.count({"status": "completed"})
    
    # Low stock count
    low_stock_products = await db_manager.db.products.count_documents({
        "$expr": {"$lte": ["$stock_quantity", "$low_stock_threshold"]}
    })
    
    # Pending custom gifts and contacts
    pending_custom_gifts = await db_manager.db.custom_gifts.count_documents(
        {"status": "pending"}
    )
    pending_contacts = await db_manager.db.contacts.count_documents(
        {"status": "pending"}
    )
    
    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_users": total_users,
        "total_sales": total_sales,
        "recent_orders": recent_orders,
        "pending_orders": pending_orders,
        "completed_orders": completed_orders,
        "low_stock_products": low_stock_products,
        "pending_custom_gifts": pending_custom_gifts,
        "pending_contacts": pending_contacts
    }


# Products Management
@router.get("/products")
async def admin_get_products(
    admin: dict = Depends(require_admin),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Get all products"""
    products = await product_repo.find({})
    return {"products": products}


@router.post("/products")
async def admin_create_product(
    product: ProductCreate,
    admin: dict = Depends(require_admin),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Create new product"""
    created_product = await product_repo.create(product.model_dump())
    return created_product


@router.put("/products/{product_id}")
async def admin_update_product(
    product_id: str,
    product: ProductCreate,
    admin: dict = Depends(require_admin),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Update product"""
    success = await product_repo.update(product_id, product.model_dump())
    if not success:
        raise HTTPException(404, "Product not found")
    return {"message": "Product updated"}


@router.delete("/products/{product_id}")
async def admin_delete_product(
    product_id: str,
    admin: dict = Depends(require_admin),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Delete product"""
    success = await product_repo.delete(product_id)
    if not success:
        raise HTTPException(404, "Product not found")
    return {"message": "Product deleted"}


# Order Management
@router.get("/orders")
async def admin_get_orders(
    admin: dict = Depends(require_admin),
    status: Optional[str] = None,
    limit: int = 100,
    skip: int = 0,
    order_repo: OrderRepository = Depends(get_order_repository)
):
    """Get all orders"""
    query = {}
    if status:
        query["status"] = status
    
    orders = await order_repo.find(query, "created_at", -1, skip, limit)
    total_count = await order_repo.count(query)
    
    return {
        "orders": orders,
        "total": total_count,
        "page": skip // limit + 1 if limit > 0 else 1,
        "per_page": limit
    }


@router.get("/orders/{order_id}")
async def admin_get_order_details(
    order_id: str,
    admin: dict = Depends(require_admin),
    order_repo: OrderRepository = Depends(get_order_repository)
):
    """Get order details"""
    order = await order_repo.get_by_id(order_id)
    if not order:
        raise HTTPException(404, "Order not found")
    return order


@router.put("/orders/{order_id}/status")
async def admin_update_order_status(
    order_id: str,
    update: OrderStatusUpdate,
    admin: dict = Depends(require_admin),
    order_repo: OrderRepository = Depends(get_order_repository)
):
    """Update order status"""
    success = await order_repo.update(order_id, {"status": update.status})
    if not success:
        raise HTTPException(404, "Order not found")
    
    # Add to status history
    await order_repo.add_status_history(order_id, update.status)
    
    return {"message": "Order status updated"}


# User Management
@router.get("/users")
async def admin_get_users(
    admin: dict = Depends(require_admin),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Get all users"""
    users = await user_repo.find({}, exclude_password=True)
    return {"users": users}


@router.delete("/users/{user_id}")
async def admin_delete_user(
    user_id: str,
    admin: dict = Depends(require_admin),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Delete user"""
    success = await user_repo.delete(user_id)
    if not success:
        raise HTTPException(404, "User not found")
    return {"message": "User deleted"}


# Custom Gifts Management
@router.get("/custom-gifts")
async def admin_get_custom_gifts(
    admin: dict = Depends(require_admin)
):
    """Get all custom gift requests"""
    from api.utils.datetime_utils import deserialize_documents
    
    gifts = await db_manager.db.custom_gifts.find(
        {}, {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    
    gifts = deserialize_documents(gifts)
    return {"custom_gifts": gifts}


@router.put("/custom-gifts/{gift_id}/status")
async def admin_update_gift_status(
    gift_id: str,
    update: Dict,
    admin: dict = Depends(require_admin)
):
    """Update custom gift request status"""
    result = await db_manager.db.custom_gifts.update_one(
        {"id": gift_id},
        {"$set": {"status": update.get("status", "responded")}}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Gift request not found")
    return {"message": "Status updated"}


# Contacts Management
@router.get("/contacts")
async def admin_get_contacts(
    admin: dict = Depends(require_admin)
):
    """Get all contact messages"""
    from api.utils.datetime_utils import deserialize_documents
    
    contacts = await db_manager.db.contacts.find(
        {}, {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    
    contacts = deserialize_documents(contacts)
    return {"contacts": contacts}


@router.put("/contacts/{contact_id}/status")
async def admin_update_contact_status(
    contact_id: str,
    update: Dict,
    admin: dict = Depends(require_admin)
):
    """Update contact message status"""
    result = await db_manager.db.contacts.update_one(
        {"id": contact_id},
        {"$set": {"status": update.get("status", "responded")}}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Contact not found")
    return {"message": "Status updated"}


# Reviews Management
@router.get("/reviews")
async def admin_get_reviews(
    status: Optional[str] = None,
    admin: dict = Depends(require_admin),
    review_repo: ReviewRepository = Depends(get_review_repository)
):
    """Get all reviews"""
    query = {}
    if status:
        query["status"] = status
    
    reviews = await review_repo.find(query, "created_at", -1, 0, 1000)
    return {"reviews": reviews}


@router.put("/reviews/{review_id}/status")
async def admin_update_review_status(
    review_id: str,
    update: Dict,
    admin: dict = Depends(require_admin),
    review_repo: ReviewRepository = Depends(get_review_repository)
):
    """Update review status"""
    review = await review_repo.get_by_id(review_id)
    if not review:
        raise HTTPException(404, "Review not found")
    
    await review_repo.update(
        review_id,
        {"status": update.get("status", "approved")}
    )
    
    # Update product rating
    await review_repo.update_product_rating(review["product_id"])
    
    return {"message": "Review status updated"}


# Coupon Management
@router.post("/coupons")
async def create_coupon(
    coupon_data: CouponCreate,
    admin: dict = Depends(require_admin),
    coupon_repo: CouponRepository = Depends(get_coupon_repository)
):
    """Create new coupon"""
    # Check if code exists
    existing = await coupon_repo.get_by_code(coupon_data.code.upper())
    if existing:
        raise HTTPException(400, "Coupon code already exists")
    
    coupon = await coupon_repo.create({
        **coupon_data.model_dump(),
        "code": coupon_data.code.upper()
    })
    
    return coupon


@router.get("/coupons")
async def list_coupons(
    admin: dict = Depends(require_admin),
    coupon_repo: CouponRepository = Depends(get_coupon_repository)
):
    """Get all coupons"""
    coupons = await coupon_repo.find({}, "created_at", -1, 0, 100)
    return {"coupons": coupons}


@router.put("/coupons/{coupon_id}")
async def update_coupon(
    coupon_id: str,
    update: Dict,
    admin: dict = Depends(require_admin),
    coupon_repo: CouponRepository = Depends(get_coupon_repository)
):
    """Update coupon"""
    update_dict = {k: v for k, v in update.items() if v is not None}
    
    success = await coupon_repo.update(coupon_id, update_dict)
    if not success:
        raise HTTPException(404, "Coupon not found")
    return {"message": "Coupon updated"}


@router.delete("/coupons/{coupon_id}")
async def delete_coupon(
    coupon_id: str,
    admin: dict = Depends(require_admin),
    coupon_repo: CouponRepository = Depends(get_coupon_repository)
):
    """Delete coupon"""
    success = await coupon_repo.delete(coupon_id)
    if not success:
        raise HTTPException(404, "Coupon not found")
    return {"message": "Coupon deleted"}


# Inventory Management
@router.put("/products/{product_id}/stock")
async def update_stock(
    product_id: str,
    quantity: int,
    admin: dict = Depends(require_admin),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Update product stock"""
    success = await product_repo.update(
        product_id,
        {
            "stock_quantity": quantity,
            "in_stock": quantity > 0
        }
    )
    if not success:
        raise HTTPException(404, "Product not found")
    return {"success": True, "message": "Stock updated"}


@router.get("/inventory/low-stock")
async def get_low_stock(
    admin: dict = Depends(require_admin)
):
    """Get low stock products"""
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
    
    products = await db_manager.db.products.aggregate(pipeline).to_list(100)
    return {"low_stock_products": products, "count": len(products)}


# Sales Analytics
@router.get("/analytics/sales")
async def admin_sales_analytics(
    days: int = 30,
    admin: dict = Depends(require_admin),
    order_repo: OrderRepository = Depends(get_order_repository)
):
    """Get sales analytics"""
    start_date = datetime.now(timezone.utc) - timedelta(days=days)
    
    orders = await order_repo.find({})
    
    # Filter and aggregate
    sales_by_date = {}
    for order in orders:
        try:
            order_date_str = order.get('created_at')
            if isinstance(order_date_str, str):
                order_date = datetime.fromisoformat(order_date_str)
            else:
                order_date = order_date_str
            
            if order_date >= start_date:
                date_str = order_date.strftime("%Y-%m-%d")
                if date_str not in sales_by_date:
                    sales_by_date[date_str] = {"total_sales": 0, "order_count": 0}
                sales_by_date[date_str]["total_sales"] += order.get("total_amount", 0)
                sales_by_date[date_str]["order_count"] += 1
        except (KeyError, ValueError, TypeError):
            continue
    
    sales_data = [
        {"_id": date, **data}
        for date, data in sorted(sales_by_date.items())
    ]
    
    return {"sales_data": sales_data, "days": days}
