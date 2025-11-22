import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();

    const variants = await db
      .collection('product_variants')
      .find({ product_id: id })
      .toArray();

    return NextResponse.json({ variants });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const { sku, size, color, stock, price_override } = body;

    if (!sku) {
      throw new APIError('SKU required', 400);
    }

    const db = await getDatabase();

    const variant = await db.collection('product_variants').insertOne({
      product_id: id,
      sku,
      size: size || null,
      color: color || null,
      stock: stock || 0,
      price_override: price_override || null,
      created_at: new Date(),
    });

    return NextResponse.json(
      { _id: variant.insertedId, ...body },
      { status: 201 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
