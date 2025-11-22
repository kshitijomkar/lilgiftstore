import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PaymentService } from '@/lib/services/payment.service';
import { handleAPIError } from '@/lib/middleware/error-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const paymentService = new PaymentService();
    await paymentService.handleWebhook(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    return handleAPIError(error);
  }
}
