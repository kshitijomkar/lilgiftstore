import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const body = await request.json();
    const { transactionId } = body;

    if (!transactionId) {
      throw new APIError('transactionId required', 400);
    }

    const db = await getDatabase();

    const transaction = await db.collection('payment_transactions').findOne({
      _id: new ObjectId(transactionId),
      user_id: user.id,
      status: 'failed',
    });

    if (!transaction) {
      throw new APIError('Failed transaction not found', 404);
    }

    // Create retry record
    const retry = await db.collection('payment_transactions').insertOne({
      order_id: transaction.order_id,
      user_id: user.id,
      amount: transaction.amount,
      status: 'pending',
      retry_of: transactionId,
      created_at: new Date(),
    });

    return NextResponse.json(retry, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
