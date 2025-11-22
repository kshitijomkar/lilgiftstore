import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { getDatabase } from '@/lib/db';
import { handleAPIError } from '@/lib/middleware/error-handler';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const db = await getDatabase();

    const format = request.nextUrl.searchParams.get('format') || 'json';
    const startDate = request.nextUrl.searchParams.get('start_date');
    const endDate = request.nextUrl.searchParams.get('end_date');

    let query: any = {};
    if (startDate || endDate) {
      query.created_at = {};
      if (startDate) query.created_at.$gte = new Date(startDate);
      if (endDate) query.created_at.$lte = new Date(endDate);
    }

    const orders = await db
      .collection('orders')
      .find(query)
      .sort({ created_at: -1 })
      .toArray();

    if (format === 'csv') {
      const csv =
        'Order ID,Date,User,Total,Status,Payment Status\n' +
        orders
          .map(
            (o: any) =>
              `${o._id},${o.created_at},${o.user_id || 'Guest'},${o.total_amount},${o.status},${o.payment_status}`
          )
          .join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="orders_${Date.now()}.csv"`,
        },
      });
    }

    // Default: JSON
    return NextResponse.json({
      format: 'json',
      count: orders.length,
      orders,
      exported_at: new Date(),
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
