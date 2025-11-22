import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/middleware/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const db = await getDatabase();

    const gift = await db.collection('custom_gifts').findOne({ _id: new ObjectId(id) });

    if (!gift) {
      throw new APIError('Custom gift request not found', 404);
    }

    return NextResponse.json(gift);
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
    const db = await getDatabase();

    const updated = await db.collection('custom_gifts').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...body, updated_at: new Date() } },
      { returnDocument: 'after' }
    );

    if (!updated.value) {
      throw new APIError('Custom gift request not found', 404);
    }

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
    requireAdmin(request);
    const { id } = await params;
    const db = await getDatabase();

    const result = await db.collection('custom_gifts').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new APIError('Custom gift request not found', 404);
    }

    return NextResponse.json({ message: 'Custom gift request deleted' });
  } catch (error) {
    return handleAPIError(error);
  }
}
