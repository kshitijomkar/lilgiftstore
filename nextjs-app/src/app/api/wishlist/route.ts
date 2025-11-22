import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ items: [] });

    const db = await getDatabase();
    const wishlistItems = await db.collection("wishlists").find({ user_id: auth.user.id }).toArray();
    
    let enrichedProducts: any[] = [];
    for (const item of wishlistItems) {
      const product = await db.collection("products").findOne({ _id: new ObjectId(item.product_id) });
      if (product) {
        enrichedProducts.push({
          id: product._id?.toString(),
          name: product.name,
          price: product.price,
          images: product.images,
          category: product.category,
          wishlist_id: item._id?.toString(),
          added_at: item.created_at
        });
      }
    }
    
    return NextResponse.json({ items: enrichedProducts, count: enrichedProducts.length });
  } catch (error) {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { product_id } = await req.json();
    const db = await getDatabase();

    const product = await db.collection("products").findOne({ _id: new ObjectId(product_id) });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const existing = await db.collection("wishlists").findOne({ user_id: auth.user.id, product_id });
    if (existing) return NextResponse.json({ error: "Already in wishlist" }, { status: 400 });

    await db.collection("wishlists").insertOne({ user_id: auth.user.id, product_id, created_at: new Date() });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { product_id } = await req.json();
    const db = await getDatabase();

    const result = await db.collection("wishlists").deleteOne({ user_id: auth.user.id, product_id });
    return result.deletedCount > 0 ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove" }, { status: 500 });
  }
}
