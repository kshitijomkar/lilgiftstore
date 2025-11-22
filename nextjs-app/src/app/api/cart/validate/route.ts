import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const db = await getDatabase();
    const cartItems = await db
      .collection('cart')
      .find({ user_id: auth.user.id })
      .toArray();

    if (cartItems.length === 0) {
      return NextResponse.json({
        valid: true,
        items: [],
        message: 'Cart is empty',
      });
    }

    const validation = [];
    let isValid = true;

    for (const item of cartItems) {
      const product = await db
        .collection('products')
        .findOne({ _id: new ObjectId(item.product_id) });

      if (!product) {
        validation.push({
          product_id: item.product_id,
          valid: false,
          reason: 'Product not found',
        });
        isValid = false;
        continue;
      }

      const stock = product.stock || 0;
      const available = stock >= item.quantity;

      validation.push({
        product_id: item.product_id,
        product_name: product.name,
        requested_quantity: item.quantity,
        available_stock: stock,
        valid: available,
        reason: available ? 'In stock' : `Only ${stock} available`,
      });

      if (!available) {
        isValid = false;
      }
    }

    return NextResponse.json({
      valid: isValid,
      items: validation,
      message: isValid
        ? 'All items in stock'
        : 'Some items have limited stock',
    });
  } catch (error) {
    console.error('Cart validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate cart' },
      { status: 500 }
    );
  }
}
