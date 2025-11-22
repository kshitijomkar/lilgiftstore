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
    const user = requireAuth(request);
    const { id } = await params;
    const db = await getDatabase();

    const payment = await db.collection('payment_transactions').findOne({
      _id: new ObjectId(id),
      user_id: user.id,
    });

    if (!payment) {
      throw new APIError('Payment not found', 404);
    }

    return NextResponse.json(payment);
  } catch (error) {
    return handleAPIError(error);
  }
}
