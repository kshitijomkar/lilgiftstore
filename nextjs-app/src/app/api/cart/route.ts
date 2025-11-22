import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id") || "default";
    const db = await getDatabase();
    
    const cartItems = await db.collection("cart").find({ session_id: sessionId }).toArray();
    
    let enrichedItems: any[] = [];
    let total = 0;
    
    for (const item of cartItems) {
      const product = await db.collection("products").findOne({
        _id: new ObjectId(item.product_id)
      });
      
      if (product) {
        const itemTotal = (product.price || 0) * item.quantity;
        total += itemTotal;
        enrichedItems.push({
          cart_item_id: item._id?.toString(),
          product: { id: product._id?.toString(), name: product.name, price: product.price, images: product.images },
          quantity: item.quantity,
          item_total: itemTotal
        });
      }
    }
    
    return NextResponse.json({ items: enrichedItems, total, item_count: enrichedItems.length });
  } catch (error) {
    return NextResponse.json({ items: [], total: 0, item_count: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { product_id, quantity, session_id } = await req.json();
    const db = await getDatabase();
    
    const product = await db.collection("products").findOne({ _id: new ObjectId(product_id) });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    
    const existing = await db.collection("cart").findOne({ session_id, product_id });
    if (existing) {
      await db.collection("cart").updateOne({ _id: existing._id }, { $set: { quantity: existing.quantity + quantity } });
      return NextResponse.json({ success: true });
    }
    
    await db.collection("cart").insertOne({ session_id, product_id, quantity, created_at: new Date() });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { cart_item_id } = await req.json();
    const db = await getDatabase();
    const result = await db.collection("cart").deleteOne({ _id: new ObjectId(cart_item_id) });
    return result.deletedCount > 0 ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
