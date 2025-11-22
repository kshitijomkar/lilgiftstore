import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const db = await getDatabase();
    const transaction = await db.collection('payment_transactions').findOne({ 
      _id: { $oid: sessionId } 
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Check if payment is complete
    if (transaction.payment_status === 'paid' && !transaction.order_id) {
      // Create order from cart
      const order = await db.collection('orders').insertOne({
        user_id: transaction.metadata?.user_id,
        items: transaction.metadata?.items || [],
        total_amount: transaction.amount,
        status: 'pending',
        payment_session_id: sessionId,
        created_at: new Date(),
      });

      // Update transaction with order_id
      await db.collection('payment_transactions').updateOne(
        { _id: { $oid: sessionId } },
        { $set: { order_id: order.insertedId.toString() } }
      );

      return NextResponse.json({
        status: 'paid',
        order_id: order.insertedId.toString(),
        amount: transaction.amount,
      });
    }

    return NextResponse.json({
      status: transaction.payment_status,
      order_id: transaction.order_id,
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 });
  }
}
