import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { CouponRepository } from '@/lib/repositories/coupon.repository';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const couponRepo = new CouponRepository();
    const coupon = await couponRepo.findById(id);

    if (!coupon) {
      throw new APIError('Coupon not found', 404);
    }

    return NextResponse.json(coupon);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const couponRepo = new CouponRepository();

    const updated = await couponRepo.update(id, {
      ...body,
      updated_at: new Date(),
    } as any);

    if (!updated) {
      throw new APIError('Coupon not found', 404);
    }

    return NextResponse.json(updated);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const couponRepo = new CouponRepository();
    const deleted = await couponRepo.delete(id);

    if (!deleted) {
      throw new APIError('Coupon not found', 404);
    }

    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    return handleAPIError(error);
  }
}
