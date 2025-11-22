import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '5');

    const db = await getDatabase();

    if (q && q.length >= 2) {
      const query = {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { tags: { $regex: q, $options: 'i' } }
        ]
      };

      const products = await db
        .collection('products')
        .find(query)
        .sort({ name: 1 })
        .limit(limit)
        .toArray();

      const suggestions = products.map((p: any) => p.name);
      return NextResponse.json({ suggestions: [...new Set(suggestions)] });
    }

    // Return popular products as default suggestions
    const popular = await db
      .collection('products')
      .find({})
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      suggestions: popular.map((p: any) => p.name)
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
