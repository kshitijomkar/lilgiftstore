"""Cart Routes"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from api.schemas import CartItem, CartItemCreate
from api.repositories.cart_repository import CartRepository
from api.repositories.product_repository import ProductRepository
from api.dependencies import get_cart_repository, get_product_repository, optional_user

router = APIRouter(prefix="/cart")


@router.post("", response_model=CartItem)
async def add_to_cart(
    item: CartItemCreate,
    cart_repo: CartRepository = Depends(get_cart_repository),
    product_repo: ProductRepository = Depends(get_product_repository),
    user: Optional[dict] = Depends(optional_user)
):
    """Add item to cart"""
    # Verify product exists
    product = await product_repo.get_by_id(item.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # If user is authenticated, add user_id to cart item
    if user and not item.user_id:
        item.user_id = user["id"]
    
    # Check if item already in cart
    existing = await cart_repo.get_by_product_and_session(
        item.product_id, item.session_id
    )
    
    if existing:
        # Update quantity and user_id if needed
        new_quantity = existing["quantity"] + item.quantity
        updated = await cart_repo.update_quantity(
            existing["id"], new_quantity
        )
        # Update user_id if authenticated and not set
        if user and not existing.get("user_id"):
            from api.config.database import db_manager
            await db_manager.db.cart.update_one(
                {"id": existing["id"]},
                {"$set": {"user_id": user["id"]}}
            )
            updated["user_id"] = user["id"]
        return updated
    
    # Create new cart item
    cart_item_data = CartItem(**item.model_dump())
    cart_item = await cart_repo.create(cart_item_data.model_dump())
    return cart_item


@router.get("/{session_id}")
async def get_cart(
    session_id: str,
    cart_repo: CartRepository = Depends(get_cart_repository),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Get cart items with product details"""
    cart_items = await cart_repo.get_by_session(session_id)
    
    enriched_items = []
    total = 0.0
    for item in cart_items:
        product = await product_repo.get_by_id(item["product_id"])
        if product:
            item_total = product["price"] * item["quantity"]
            total += item_total
            enriched_items.append({
                "cart_item_id": item["id"],
                "product": product,
                "quantity": item["quantity"],
                "item_total": item_total
            })
    
    return {
        "items": enriched_items,
        "total": total,
        "item_count": len(enriched_items)
    }


@router.delete("/{cart_item_id}")
async def remove_from_cart(
    cart_item_id: str,
    cart_repo: CartRepository = Depends(get_cart_repository)
):
    """Remove item from cart"""
    success = await cart_repo.delete(cart_item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"success": True, "message": "Item removed from cart"}


@router.put("")
async def update_cart_item(
    item: CartItemCreate,
    cart_repo: CartRepository = Depends(get_cart_repository),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Update cart item quantity"""
    # Verify product exists
    product = await product_repo.get_by_id(item.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Find existing cart item
    existing = await cart_repo.get_by_product_and_session(
        item.product_id, item.session_id
    )
    
    if not existing:
        raise HTTPException(status_code=404, detail="Item not in cart")
    
    # Update quantity
    updated = await cart_repo.update_quantity(existing["id"], item.quantity)
    return updated

async def remove_from_cart(
    cart_item_id: str,
    cart_repo: CartRepository = Depends(get_cart_repository)
):
    """Remove item from cart"""
    deleted = await cart_repo.delete(cart_item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Item removed from cart"}


@router.delete("/session/{session_id}")
async def clear_cart(
    session_id: str,
    cart_repo: CartRepository = Depends(get_cart_repository)
):
    """Clear entire cart"""
    await cart_repo.clear_session(session_id)
    return {"message": "Cart cleared"}
