import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');

    if (!q || q.length < 2) {
      return NextResponse.json({ products: [], total: 0 });
    }

    const db = await getDatabase();
    const query = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    };

    const products = await db
      .collection('products')
      .find(query)
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();

    const total = await db.collection('products').countDocuments(query);

    return NextResponse.json({
      products: products.map((p: any) => ({
        id: p._id?.toString() || p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        images: p.images,
      })),
      total
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
