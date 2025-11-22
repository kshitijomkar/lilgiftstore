import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { getDatabase } from '@/lib/db';
import { handleAPIError } from '@/lib/middleware/error-handler';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const db = await getDatabase();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const sales = await db.collection('orders').aggregate([
      {
        $match: {
          created_at: { $gte: thirtyDaysAgo },
          payment_status: 'completed',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
          total: { $sum: '$total_amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]).toArray();

    return NextResponse.json({ sales });
  } catch (error) {
    return handleAPIError(error);
  }
}
