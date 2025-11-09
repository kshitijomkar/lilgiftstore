"""API Routes Package"""
from fastapi import APIRouter
from .auth import router as auth_router
from .products import router as products_router
from .cart import router as cart_router
from .orders import router as orders_router, track_router
from .payments import router as payments_router
from .reviews import router as reviews_router
from .wishlist import router as wishlist_router
from .coupons import router as coupons_router
from .users import router as users_router
from .admin import router as admin_router
from .custom_gifts import router as custom_gifts_router
from .contacts import router as contacts_router

# Main API router
api_router = APIRouter(prefix="/api")

# Include all sub-routers
api_router.include_router(auth_router, tags=["Authentication"])
api_router.include_router(products_router, tags=["Products"])
api_router.include_router(cart_router, tags=["Cart"])
api_router.include_router(orders_router, tags=["Orders"])
api_router.include_router(track_router, tags=["Orders"])  # Track order at root level
api_router.include_router(payments_router, tags=["Payments"])
api_router.include_router(reviews_router, tags=["Reviews"])
api_router.include_router(wishlist_router, tags=["Wishlist"])
api_router.include_router(coupons_router, tags=["Coupons"])
api_router.include_router(users_router, tags=["Users"])
api_router.include_router(custom_gifts_router, tags=["Custom Gifts"])
api_router.include_router(contacts_router, tags=["Contact"])
api_router.include_router(admin_router, tags=["Admin"])

__all__ = ["api_router"]
