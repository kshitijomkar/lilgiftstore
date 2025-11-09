"""Dependency injection for FastAPI routes"""
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from api.config.database import get_database
from api.repositories import (
    ProductRepository, CartRepository, OrderRepository,
    UserRepository, ReviewRepository, WishlistRepository,
    CouponRepository
)
from api.utils.auth import AuthUtils

security = HTTPBearer()
security_optional = HTTPBearer(auto_error=False)


# Database dependency
def get_db():
    """Get database instance"""
    return get_database()


# Repository dependencies
def get_product_repository(db=Depends(get_db)):
    """Get product repository"""
    return ProductRepository(db)


def get_cart_repository(db=Depends(get_db)):
    """Get cart repository"""
    return CartRepository(db)


def get_order_repository(db=Depends(get_db)):
    """Get order repository"""
    return OrderRepository(db)


def get_user_repository(db=Depends(get_db)):
    """Get user repository"""
    return UserRepository(db)


def get_review_repository(db=Depends(get_db)):
    """Get review repository"""
    return ReviewRepository(db)


def get_wishlist_repository(db=Depends(get_db)):
    """Get wishlist repository"""
    return WishlistRepository(db)


def get_coupon_repository(db=Depends(get_db)):
    """Get coupon repository"""
    return CouponRepository(db)


# Authentication dependencies
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Get current authenticated user"""
    try:
        token = credentials.credentials
        payload = AuthUtils.decode_token(token)
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


async def optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_optional),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Get current user if authenticated, otherwise None"""
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        payload = AuthUtils.decode_token(token)
        user_id = payload.get("user_id")
        
        if user_id:
            user = await user_repo.get_by_id(user_id)
            return user
    except Exception:
        pass
    
    return None


async def require_admin(user: dict = Depends(get_current_user)):
    """Require admin role"""
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
