import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const db = await getDatabase();
    const coupons = await db.collection("coupons").find({ is_active: true }).toArray();
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { code, order_value } = await req.json();
    const db = await getDatabase();
    
    const coupon = await db.collection("coupons").findOne({ code: code.toUpperCase() });
    
    if (!coupon || !coupon.is_active) {
      return NextResponse.json({ valid: false, error: "Invalid coupon code" }, { status: 400 });
    }

    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return NextResponse.json({ valid: false, error: "Coupon not yet valid" }, { status: 400 });
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return NextResponse.json({ valid: false, error: "Coupon expired" }, { status: 400 });
    }

    if (order_value < (coupon.min_order_value || 0)) {
      return NextResponse.json({ valid: false, error: `Minimum order value ₹${coupon.min_order_value}` }, { status: 400 });
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = order_value * (coupon.value / 100);
      if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);
    } else if (coupon.type === "fixed") {
      discount = coupon.value;
    }

    return NextResponse.json({
      valid: true,
      coupon: { code: coupon.code, type: coupon.type, value: coupon.value },
      discount_amount: Math.round(discount * 100) / 100,
      final_amount: Math.round((order_value - discount) * 100) / 100
    });
  } catch (error) {
    return NextResponse.json({ valid: false, error: "Validation failed" }, { status: 500 });
  }
}
