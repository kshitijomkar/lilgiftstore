"""Product Routes"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from api.schemas import Product
from api.repositories.product_repository import ProductRepository
from api.dependencies import get_product_repository

router = APIRouter(prefix="/products")


@router.get("/search")
async def search_products(
    q: str = Query(..., min_length=2),
    limit: int = 20,
    skip: int = 0,
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Search products by name, description, or tags"""
    query = {
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"tags": {"$regex": q, "$options": "i"}}
        ]
    }
    
    products = await product_repo.find(query, "created_at", -1, skip, limit)
    return {"products": products, "total": len(products)}


@router.get("/categories")
async def get_categories(
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Get all product categories"""
    products = await product_repo.find({}, limit=1000)
    categories = list(set([p["category"] for p in products if "category" in p]))
    return {"categories": categories}


@router.get("/suggestions")
async def get_search_suggestions(
    q: str = Query(..., min_length=2),
    limit: int = 5,
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Get search suggestions"""
    query = {
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"tags": {"$regex": q, "$options": "i"}}
        ]
    }
    
    products = await product_repo.find(query, "name", 1, 0, limit)
    suggestions = list(set([p["name"] for p in products]))
    
    return {"suggestions": suggestions[:limit]}


@router.get("", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    limit: Optional[int] = 100,
    skip: Optional[int] = 0,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    tags: Optional[str] = None,
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Get all products with filters"""
    query = {}
    
    # Category filter
    if category:
        query["category"] = category
    
    # Search filter
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    
    # Price range filter
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
    
    # Tags filter
    if tags:
        tag_list = [t.strip() for t in tags.split(",")]
        query["tags"] = {"$in": tag_list}
    
    # Sort
    sort_order = -1 if order == "desc" else 1
    sort_field = sort_by if sort_by in ["price", "created_at", "name", "average_rating"] else "created_at"
    
    products = await product_repo.find(query, sort_field, sort_order, skip, limit)
    return products


@router.get("/{product_id}", response_model=Product)
async def get_product(
    product_id: str,
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Get single product by ID"""
    product = await product_repo.get_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
