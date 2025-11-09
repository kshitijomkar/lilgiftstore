"""Wishlist Routes"""
from fastapi import APIRouter, HTTPException, Depends, Body
from pydantic import BaseModel
from api.repositories.wishlist_repository import WishlistRepository
from api.repositories.product_repository import ProductRepository
from api.dependencies import (
    get_wishlist_repository,
    get_product_repository,
    get_current_user
)

router = APIRouter(prefix="/wishlist")


class WishlistAddRequest(BaseModel):
    """Request body for adding to wishlist"""
    product_id: str


@router.post("")
async def add_to_wishlist(
    request: WishlistAddRequest,
    user: dict = Depends(get_current_user),
    wishlist_repo: WishlistRepository = Depends(get_wishlist_repository),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Add product to wishlist"""
    product_id = request.product_id
    
    # Check product exists
    product = await product_repo.get_by_id(product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    
    # Check if already in wishlist
    existing = await wishlist_repo.get_user_product_wishlist(
        user["id"], product_id
    )
    if existing:
        raise HTTPException(400, "Product already in wishlist")
    
    # Add to wishlist
    from api.schemas import WishlistItem
    wishlist_obj = WishlistItem(
        user_id=user["id"],
        product_id=product_id
    )
    await wishlist_repo.create(wishlist_obj.model_dump())
    
    return {"success": True, "message": "Added to wishlist"}


@router.get("")
async def get_wishlist(
    user: dict = Depends(get_current_user),
    wishlist_repo: WishlistRepository = Depends(get_wishlist_repository),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Get user wishlist"""
    items = await wishlist_repo.get_user_wishlist(user["id"])
    
    # Enrich with product details
    product_ids = [item["product_id"] for item in items]
    products = await product_repo.get_by_ids(product_ids)
    
    # Add wishlist metadata
    for product in products:
        wishlist_item = next(
            (i for i in items if i["product_id"] == product["id"]),
            None
        )
        if wishlist_item:
            product["wishlist_id"] = wishlist_item["id"]
            product["added_at"] = wishlist_item["created_at"]
    
    return {"items": products, "count": len(products)}


@router.delete("/{product_id}")
async def remove_from_wishlist(
    product_id: str,
    user: dict = Depends(get_current_user),
    wishlist_repo: WishlistRepository = Depends(get_wishlist_repository)
):
    """Remove from wishlist"""
    deleted = await wishlist_repo.delete_user_product(
        user["id"], product_id
    )
    
    if not deleted:
        raise HTTPException(404, "Item not found in wishlist")
    
    return {"success": True, "message": "Removed from wishlist"}


@router.get("/check/{product_id}")
async def check_wishlist(
    product_id: str,
    user: dict = Depends(get_current_user),
    wishlist_repo: WishlistRepository = Depends(get_wishlist_repository)
):
    """Check if product is in wishlist"""
    item = await wishlist_repo.get_user_product_wishlist(
        user["id"], product_id
    )
    return {"in_wishlist": bool(item)}

