import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { id, variantId } = await params;
    const db = await getDatabase();

    const variant = await db.collection('product_variants').findOne({
      _id: new ObjectId(variantId),
      product_id: id,
    });

    if (!variant) {
      throw new APIError('Variant not found', 404);
    }

    return NextResponse.json(variant);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    requireAdmin(request);
    const { id, variantId } = await params;
    const body = await request.json();
    const db = await getDatabase();

    const updated = await db.collection('product_variants').findOneAndUpdate(
      { _id: new ObjectId(variantId), product_id: id },
      { $set: { ...body, updated_at: new Date() } },
      { returnDocument: 'after' }
    );

    if (!updated.value) {
      throw new APIError('Variant not found', 404);
    }

    return NextResponse.json(updated.value);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    requireAdmin(request);
    const { id, variantId } = await params;
    const db = await getDatabase();

    const result = await db.collection('product_variants').deleteOne({
      _id: new ObjectId(variantId),
      product_id: id,
    });

    if (result.deletedCount === 0) {
      throw new APIError('Variant not found', 404);
    }

    return NextResponse.json({ message: 'Variant deleted' });
  } catch (error) {
    return handleAPIError(error);
  }
}
