import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const db = await getDatabase();
    const category = req.nextUrl.searchParams.get('category');
    const search = req.nextUrl.searchParams.get('search');
    const minPrice = req.nextUrl.searchParams.get('min_price');
    const maxPrice = req.nextUrl.searchParams.get('max_price');
    const sort = req.nextUrl.searchParams.get('sort') || 'created_at';
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50');

    let query: any = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    const tags = req.nextUrl.searchParams.get('tags');
    if (tags) {
      const tagList = tags.split(',').map(t => t.trim());
      query.tags = { $in: tagList };
    }
    const skip = parseInt(req.nextUrl.searchParams.get('skip') || '0');

    const sortObj: any = {};
    if (sort === 'price_asc') sortObj.price = 1;
    else if (sort === 'price_desc') sortObj.price = -1;
    else if (sort === 'name') sortObj.name = 1;
    else sortObj.created_at = -1;

    const products = await db
      .collection("products")
      .find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json(
      products.map((p: any) => ({
        id: p._id?.toString() || p.id,
        name: p.name || "Product",
        price: p.price || 0,
        category: p.category || "Gift",
        images: p.images || ["https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=400"],
        description: p.description || "",
        stock_quantity: p.stock_quantity || 100,
        tags: p.tags || ["gift"]
      }))
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();
    const result = await db.collection("products").insertOne({
      ...body,
      createdAt: new Date(),
    });
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
