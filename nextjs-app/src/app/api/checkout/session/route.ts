import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

export async function POST(req: NextRequest) {
  try {
    const { items, cartTotal } = await req.json();
    
    if (!items || items.length === 0 || !cartTotal) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const db = await getDatabase();
    const user = getUserFromRequest(req);

    // Store transaction in DB
    const transaction = await db.collection('payment_transactions').insertOne({
      amount: cartTotal,
      currency: 'inr',
      payment_status: 'pending',
      status: 'initiated',
      metadata: { items, user_id: user?.id },
      created_at: new Date(),
    });

    // In production, use Stripe SDK here
    // For now, return mock session for testing
    return NextResponse.json({
      session_id: transaction.insertedId.toString(),
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout/success?session_id=${transaction.insertedId.toString()}`,
      amount: cartTotal,
      currency: 'inr',
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
