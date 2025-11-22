import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { CouponRepository } from '@/lib/repositories/coupon.repository';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const couponRepo = new CouponRepository();
    const coupons = await couponRepo.findAll();

    return NextResponse.json({ coupons });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();
    const { code, discount_type, discount_value, min_purchase, max_uses, expiry_date } = body;

    if (!code || !discount_type || !discount_value) {
      throw new APIError('code, discount_type, and discount_value required', 400);
    }

    const couponRepo = new CouponRepository();
    const coupon = await couponRepo.create({
      code: code.toUpperCase(),
      discount_type,
      discount_value,
      min_purchase,
      max_uses,
      expiry_date,
      active: true,
      created_at: new Date(),
    } as any);

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
