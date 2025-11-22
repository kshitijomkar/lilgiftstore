import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { emailService } from "@/lib/services/email.service";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const db = await getDatabase();
    const orders = await db.collection("orders").find({ user_id: auth.user.id }).sort({ created_at: -1 }).toArray();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ orders: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { items, total_amount, session_id } = await req.json();
    if (!items || items.length === 0) return NextResponse.json({ error: "Empty order" }, { status: 400 });

    const db = await getDatabase();

    const result = await db.collection("orders").insertOne({
      user_id: auth.user.id,
      items,
      total_amount,
      status: "pending",
      timeline: [{ status: "pending", timestamp: new Date() }],
      created_at: new Date()
    });

    if (session_id) {
      await db.collection("cart").deleteMany({ session_id });
    }

    // Send order confirmation email
    try {
      const user = await db.collection("users").findOne({ _id: auth.user.id });
      if (user?.email) {
        await emailService.sendOrderConfirmation(
          user.email,
          result.insertedId.toString(),
          total_amount,
          items
        );
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({ success: true, order_id: result.insertedId.toString() });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
