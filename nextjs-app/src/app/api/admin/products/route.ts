import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const db = await getDatabase();
    const products = await db.collection('products')
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Admin products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const productData = await req.json();
    const db = await getDatabase();

    const result = await db.collection('products').insertOne({
      ...productData,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json({ 
      id: result.insertedId.toString(),
      message: 'Product created successfully' 
    });
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
