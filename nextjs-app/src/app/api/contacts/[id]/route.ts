import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
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

    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });

    if (!contact) {
      throw new APIError('Contact message not found', 404);
    }

    return NextResponse.json(contact);
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

    const updated = await db.collection('contacts').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...body, updated_at: new Date() } },
      { returnDocument: 'after' }
    );

    if (!updated.value) {
      throw new APIError('Contact message not found', 404);
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

    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new APIError('Contact message not found', 404);
    }

    return NextResponse.json({ message: 'Contact message deleted' });
  } catch (error) {
    return handleAPIError(error);
  }
}
