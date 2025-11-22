import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get("product_id");
    const sortBy = req.nextUrl.searchParams.get("sort_by") || "recent";
    const db = await getDatabase();
    
    let sort: any = { created_at: -1 };
    if (sortBy === "helpful") sort = { helpful_count: -1 };
    else if (sortBy === "rating_high") sort = { rating: -1 };
    else if (sortBy === "rating_low") sort = { rating: 1 };
    
    const reviews = await db
      .collection("reviews")
      .find(productId ? { product_id: productId } : {})
      .sort(sort)
      .toArray();

    return NextResponse.json({ reviews, total: reviews.length });
  } catch (error) {
    return NextResponse.json({ reviews: [], total: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { product_id, rating, title, review_text } = await req.json();
    const db = await getDatabase();

    const existing = await db.collection("reviews").findOne({ user_id: auth.user.id, product_id });
    if (existing) return NextResponse.json({ error: "You already reviewed this product" }, { status: 400 });

    const result = await db.collection("reviews").insertOne({
      product_id,
      user_id: auth.user.id,
      user_name: auth.user.email,
      rating,
      title,
      review_text,
      helpful_count: 0,
      created_at: new Date()
    });

    return NextResponse.json({ success: true, review_id: result.insertedId.toString() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
