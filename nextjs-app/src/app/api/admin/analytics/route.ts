import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const db = await getDatabase();

    const totalProducts = await db.collection("products").countDocuments();
    const totalOrders = await db.collection("orders").countDocuments();
    const totalUsers = await db.collection("users").countDocuments({ role: "customer" });

    const orders = await db.collection("orders").find().toArray();
    const totalRevenue = orders.reduce(
      (sum: number, order: any) => sum + order.total_amount,
      0
    );

    const lowStockProducts = await db
      .collection("products")
      .find({
        $expr: {
          $lte: ["$stock_quantity", "$low_stock_threshold"],
        },
      })
      .toArray();

    const pendingOrders = await db
      .collection("orders")
      .countDocuments({ status: "pending" });

    return NextResponse.json({
      total_products: totalProducts,
      total_orders: totalOrders,
      total_users: totalUsers,
      total_revenue: totalRevenue,
      low_stock_count: lowStockProducts.length,
      low_stock_products: lowStockProducts,
      pending_orders: pendingOrders,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
