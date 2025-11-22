import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const db = await getDatabase();

    // Fetch analytics
    const totalProducts = await db.collection('products').countDocuments({});
    const totalOrders = await db.collection('orders').countDocuments({});
    const totalUsers = await db.collection('users').countDocuments({});

    // Calculate total sales
    const ordersData = await db.collection('orders')
      .find({})
      .toArray();
    const totalSales = ordersData.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

    // Recent orders
    const recentOrders = await db.collection('orders')
      .find({})
      .sort({ created_at: -1 })
      .limit(5)
      .toArray();

    // Order statuses
    const pendingOrders = await db.collection('orders').countDocuments({ status: 'pending' });
    const completedOrders = await db.collection('orders').countDocuments({ status: 'completed' });

    // Low stock products
    const lowStockProducts = await db.collection('products')
      .countDocuments({ stock_quantity: { $lte: 10 } });

    // Pending requests
    const pendingCustomGifts = await db.collection('custom_gifts').countDocuments({ status: 'pending' });
    const pendingContacts = await db.collection('contacts').countDocuments({ status: 'pending' });

    return NextResponse.json({
      total_products: totalProducts,
      total_orders: totalOrders,
      total_users: totalUsers,
      total_sales: totalSales,
      recent_orders: recentOrders.slice(0, 5),
      pending_orders: pendingOrders,
      completed_orders: completedOrders,
      low_stock_products: lowStockProducts,
      pending_custom_gifts: pendingCustomGifts,
      pending_contacts: pendingContacts,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
  }
}
