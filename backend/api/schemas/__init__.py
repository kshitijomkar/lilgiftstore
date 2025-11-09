"""Pydantic schemas for request/response validation"""
from .product import Product, ProductCreate, ProductUpdate
from .user import User, UserCreate, UserUpdate, LoginRequest
from .order import Order, OrderCreate, OrderStatusUpdate
from .cart import CartItem, CartItemCreate
from .review import Review, ReviewCreate
from .wishlist import WishlistItem
from .coupon import Coupon, CouponCreate, CouponValidate, CouponUsage
from .address import Address, AddressCreate
from .contact import ContactRequest, ContactCreate
from .custom_gift import CustomGiftRequest, CustomGiftCreate
from .payment import PaymentTransaction

__all__ = [
    "Product", "ProductCreate", "ProductUpdate",
    "User", "UserCreate", "UserUpdate", "LoginRequest",
    "Order", "OrderCreate", "OrderStatusUpdate",
    "CartItem", "CartItemCreate",
    "Review", "ReviewCreate",
    "WishlistItem",
    "Coupon", "CouponCreate", "CouponValidate", "CouponUsage",
    "Address", "AddressCreate",
    "ContactRequest", "ContactCreate",
    "CustomGiftRequest", "CustomGiftCreate",
    "PaymentTransaction",
]

