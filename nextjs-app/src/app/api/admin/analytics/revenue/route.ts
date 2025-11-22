import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { getDatabase } from '@/lib/db';
import { handleAPIError } from '@/lib/middleware/error-handler';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const db = await getDatabase();

    const result = await db.collection('orders').aggregate([
      { $match: { payment_status: 'completed' } },
      {
        $group: {
          _id: null,
          total_revenue: { $sum: '$total_amount' },
          total_orders: { $sum: 1 },
          average_order_value: { $avg: '$total_amount' },
        },
      },
    ]).toArray();

    return NextResponse.json(result[0] || {});
  } catch (error) {
    return handleAPIError(error);
  }
}
