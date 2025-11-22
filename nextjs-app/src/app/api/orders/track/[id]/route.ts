import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    
    const order = await db.collection('orders').findOne({ id });

    if (!order) {
      throw new APIError('Order not found', 404);
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      total_amount: order.total_amount,
      created_at: order.created_at,
      estimated_delivery: order.estimated_delivery,
      tracking_number: order.tracking_number,
      items: order.items,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
