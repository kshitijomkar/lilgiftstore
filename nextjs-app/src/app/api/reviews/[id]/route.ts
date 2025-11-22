import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const review = await db.collection('reviews').findOne({ _id: new ObjectId(id) });

    if (!review) {
      throw new APIError('Review not found', 404);
    }

    return NextResponse.json(review);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    const { id } = await params;
    const body = await request.json();

    const db = await getDatabase();
    const review = await db.collection('reviews').findOne({ _id: new ObjectId(id) });

    if (!review) {
      throw new APIError('Review not found', 404);
    }

    if (review.user_id !== user.id) {
      throw new APIError('Cannot update review', 403);
    }

    const updated = await db.collection('reviews').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...body, updated_at: new Date() } },
      { returnDocument: 'after' }
    );

    return NextResponse.json(updated.value);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    const { id } = await params;

    const db = await getDatabase();
    const review = await db.collection('reviews').findOne({ _id: new ObjectId(id) });

    if (!review) {
      throw new APIError('Review not found', 404);
    }

    if (review.user_id !== user.id && user.role !== 'admin') {
      throw new APIError('Cannot delete review', 403);
    }

    await db.collection('reviews').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Review deleted' });
  } catch (error) {
    return handleAPIError(error);
  }
}
