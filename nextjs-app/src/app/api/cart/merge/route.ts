import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { guest_session_id } = await request.json();
    if (!guest_session_id) {
      return NextResponse.json(
        { error: 'guest_session_id required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const guestItems = await db
      .collection('cart')
      .find({ session_id: guest_session_id })
      .toArray();

    if (guestItems.length === 0) {
      return NextResponse.json({
        message: 'No guest cart items to merge',
        merged_count: 0,
      });
    }

    let mergedCount = 0;

    for (const guestItem of guestItems) {
      const existingItem = await db.collection('cart').findOne({
        user_id: auth.user.id,
        product_id: guestItem.product_id,
      });

      if (existingItem) {
        await db.collection('cart').updateOne(
          { _id: existingItem._id },
          {
            $inc: { quantity: guestItem.quantity },
            $set: { updated_at: new Date() },
          }
        );
      } else {
        await db.collection('cart').insertOne({
          user_id: auth.user.id,
          product_id: guestItem.product_id,
          quantity: guestItem.quantity,
          created_at: new Date(),
        });
      }
      mergedCount++;
    }

    // Delete guest cart items
    await db.collection('cart').deleteMany({ session_id: guest_session_id });

    return NextResponse.json({
      message: 'Cart merged successfully',
      merged_count: mergedCount,
    });
  } catch (error) {
    console.error('Cart merge error:', error);
    return NextResponse.json(
      { error: 'Failed to merge cart' },
      { status: 500 }
    );
  }
}
