"""Review Routes"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from api.schemas import Review, ReviewCreate
from api.repositories.review_repository import ReviewRepository
from api.repositories.product_repository import ProductRepository
from api.repositories.order_repository import OrderRepository
from api.dependencies import (
    get_review_repository,
    get_product_repository,
    get_order_repository,
    get_current_user
)

router = APIRouter()


@router.post("/products/{product_id}/reviews")
async def create_review(
    product_id: str,
    review_data: ReviewCreate,
    user: dict = Depends(get_current_user),
    review_repo: ReviewRepository = Depends(get_review_repository),
    product_repo: ProductRepository = Depends(get_product_repository),
    order_repo: OrderRepository = Depends(get_order_repository)
):
    """Create product review"""
    # Check if user already reviewed
    existing = await review_repo.get_user_product_review(user["id"], product_id)
    if existing:
        raise HTTPException(400, "You have already reviewed this product")
    
    # Check if user purchased this product
    orders = await order_repo.get_user_orders(user["id"])
    verified = any(
        any(item.get("product_id") == product_id for item in order.get("items", []))
        for order in orders
        if order.get("status") in ["completed", "delivered"]
    )
    
    # Create review
    review = await review_repo.create({
        "product_id": product_id,
        "user_id": user["id"],
        "user_name": user["name"],
        "rating": review_data.rating,
        "title": review_data.title,
        "review_text": review_data.review_text,
        "verified_purchase": verified
    })
    
    # Update product rating
    await review_repo.update_product_rating(product_id)
    
    return review


@router.get("/products/{product_id}/reviews")
async def get_reviews(
    product_id: str,
    sort_by: str = "recent",
    limit: int = 20,
    skip: int = 0,
    review_repo: ReviewRepository = Depends(get_review_repository)
):
    """Get product reviews"""
    reviews = await review_repo.get_product_reviews(
        product_id, sort_by, limit, skip
    )
    total = await review_repo.count_product_reviews(product_id)
    
    return {"reviews": reviews, "total": total}


@router.post("/reviews/{review_id}/helpful")
async def mark_helpful(
    review_id: str,
    review_repo: ReviewRepository = Depends(get_review_repository)
):
    """Mark review as helpful"""
    success = await review_repo.increment_helpful(review_id)
    if not success:
        raise HTTPException(404, "Review not found")
    return {"success": True}


@router.delete("/reviews/{review_id}")
async def delete_review(
    review_id: str,
    user: dict = Depends(get_current_user),
    review_repo: ReviewRepository = Depends(get_review_repository)
):
    """Delete review"""
    review = await review_repo.get_by_id(review_id)
    if not review:
        raise HTTPException(404, "Review not found")
    
    # Check authorization
    if review["user_id"] != user["id"] and user.get("role") != "admin":
        raise HTTPException(403, "Not authorized to delete this review")
    
    await review_repo.delete(review_id)
    await review_repo.update_product_rating(review["product_id"])
    
    return {"message": "Review deleted"}

