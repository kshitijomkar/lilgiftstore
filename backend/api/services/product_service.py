"""Product service with business logic"""
from typing import List, Dict, Optional
from fastapi import HTTPException
from api.repositories import ProductRepository
from api.schemas import Product, ProductCreate
from api.utils.datetime_utils import serialize_document


class ProductService:
    """Product business logic"""
    
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo
    
    async def get_products(self, category: Optional[str] = None, search: Optional[str] = None,
                          min_price: Optional[float] = None, max_price: Optional[float] = None,
                          tags: Optional[str] = None, limit: int = 100, skip: int = 0,
                          sort_by: str = "created_at", order: str = "desc") -> List[Dict]:
        """Get products with filters"""
        tag_list = [t.strip() for t in tags.split(",")] if tags else None
        return await self.product_repo.search_products(
            query=search or "",
            category=category,
            min_price=min_price,
            max_price=max_price,
            tags=tag_list,
            limit=limit,
            skip=skip,
            sort_by=sort_by,
            order=order
        )
    
    async def get_product_by_id(self, product_id: str) -> Dict:
        """Get product by ID"""
        product = await self.product_repo.find_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    
    async def create_product(self, product_data: ProductCreate) -> Dict:
        """Create a new product"""
        product = Product(**product_data.model_dump())
        doc = serialize_document(product.model_dump())
        return await self.product_repo.create(doc)
    
    async def update_product(self, product_id: str, product_data: Dict) -> bool:
        """Update a product"""
        success = await self.product_repo.update(product_id, product_data)
        if not success:
            raise HTTPException(status_code=404, detail="Product not found")
        return True
    
    async def delete_product(self, product_id: str) -> bool:
        """Delete a product"""
        success = await self.product_repo.delete(product_id)
        if not success:
            raise HTTPException(status_code=404, detail="Product not found")
        return True
    
    async def get_categories(self) -> List[str]:
        """Get all product categories"""
        products = await self.product_repo.find_many(limit=1000)
        categories = list(set([p["category"] for p in products if "category" in p]))
        return sorted(categories)
