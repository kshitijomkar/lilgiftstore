import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const body = await request.json();
    const { orderId, reason } = body;

    if (!orderId) {
      throw new APIError('orderId required', 400);
    }

    const db = await getDatabase();
    
    // Find order
    const order = await db.collection('orders').findOne({
      _id: new ObjectId(orderId),
      user_id: user.id,
    });

    if (!order) {
      throw new APIError('Order not found', 404);
    }

    if (order.payment_status !== 'completed') {
      throw new APIError('Only completed payments can be refunded', 400);
    }

    // Create refund record
    const refund = await db.collection('refunds').insertOne({
      order_id: new ObjectId(orderId),
      user_id: user.id,
      amount: order.total_amount,
      reason,
      status: 'pending',
      created_at: new Date(),
    });

    // Update order
    await db.collection('orders').updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { refund_status: 'pending', refund_reason: reason } }
    );

    return NextResponse.json(refund, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
