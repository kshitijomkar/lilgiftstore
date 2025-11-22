import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      throw new APIError('Valid quantity required', 400);
    }

    const db = await getDatabase();
    const result = await db.collection('cart').findOneAndUpdate(
      { _id: new ObjectId(itemId) },
      { $set: { quantity } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      throw new APIError('Cart item not found', 404);
    }

    return NextResponse.json(result.value);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const db = await getDatabase();

    const result = await db.collection('cart').deleteOne({
      _id: new ObjectId(itemId)
    });

    if (result.deletedCount === 0) {
      throw new APIError('Cart item not found', 404);
    }

    return NextResponse.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    return handleAPIError(error);
  }
}
