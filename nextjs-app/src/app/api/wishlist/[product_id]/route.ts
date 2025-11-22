import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ product_id: string }> }
) {
  try {
    const { product_id } = await params;
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ in_wishlist: false });

    const db = await getDatabase();
    const item = await db.collection("wishlists").findOne({
      user_id: auth.user.id,
      product_id: product_id
    });

    return NextResponse.json({ in_wishlist: !!item });
  } catch (error) {
    return NextResponse.json({ in_wishlist: false });
  }
}
