"""Coupon Routes"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
from api.schemas import CouponValidate
from api.repositories.coupon_repository import CouponRepository
from api.dependencies import get_coupon_repository, get_current_user

router = APIRouter(prefix="/coupons")


@router.post("/validate")
async def validate_coupon(
    validate_data: CouponValidate,
    user: dict = Depends(get_current_user),
    coupon_repo: CouponRepository = Depends(get_coupon_repository)
):
    """Validate and calculate coupon discount"""
    coupon = await coupon_repo.get_by_code(validate_data.code.upper())
    
    if not coupon or not coupon.get("is_active"):
        raise HTTPException(404, "Invalid coupon code")
    
    # Check validity period
    now = datetime.now(timezone.utc)
    valid_from = datetime.fromisoformat(coupon['valid_from'])
    valid_until = datetime.fromisoformat(coupon['valid_until'])
    
    if now < valid_from:
        raise HTTPException(400, "Coupon not yet valid")
    if now > valid_until:
        raise HTTPException(400, "Coupon has expired")
    
    # Check minimum order value
    if validate_data.order_value < coupon['min_order_value']:
        raise HTTPException(
            400,
            f"Minimum order value ₹{coupon['min_order_value']} required"
        )
    
    # Check usage limits
    if coupon.get('usage_limit') and coupon['usage_count'] >= coupon['usage_limit']:
        raise HTTPException(400, "Coupon usage limit reached")
    
    user_usage = await coupon_repo.get_user_usage_count(
        coupon['id'], user["id"]
    )
    if user_usage >= coupon['user_usage_limit']:
        raise HTTPException(400, "You've already used this coupon")
    
    # Calculate discount
    discount = 0
    if coupon['type'] == 'percentage':
        discount = validate_data.order_value * (coupon['value'] / 100)
        if coupon.get('max_discount'):
            discount = min(discount, coupon['max_discount'])
    elif coupon['type'] == 'fixed':
        discount = coupon['value']
    elif coupon['type'] == 'free_shipping':
        discount = 0
    
    return {
        "valid": True,
        "coupon": coupon,
        "discount_amount": round(discount, 2),
        "final_amount": round(validate_data.order_value - discount, 2)
    }


@router.get("/active")
async def get_active_coupons(
    coupon_repo: CouponRepository = Depends(get_coupon_repository)
):
    """Get all active coupons (public)"""
    coupons = await coupon_repo.get_active_coupons()
    
    # Return only public information
    return [{
        "code": c["code"],
        "type": c["type"],
        "value": c["value"],
        "min_order_value": c["min_order_value"],
        "valid_until": c["valid_until"]
    } for c in coupons]
