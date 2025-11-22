import Stripe from 'stripe';
import { OrderRepository } from '@/lib/repositories/order.repository';
import { APIError } from '@/lib/middleware/error-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export class PaymentService {
  private orderRepo: OrderRepository;

  constructor() {
    this.orderRepo = new OrderRepository();
  }

  async createCheckoutSession(data: {
    order_id: string;
    amount: number;
    currency?: string;
    user_id: string;
    success_url: string;
    cancel_url: string;
  }) {
    const order = await this.orderRepo.findById(data.order_id);
    if (!order) {
      throw new APIError('Order not found', 404);
    }

    if (order.user_id !== data.user_id) {
      throw new APIError('Unauthorized', 403);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: data.currency || 'usd',
            product_data: {
              name: `Order #${data.order_id}`,
            },
            unit_amount: Math.round(data.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: data.success_url,
      cancel_url: data.cancel_url,
      metadata: {
        order_id: data.order_id,
        user_id: data.user_id,
      },
    });

    await this.orderRepo.update(data.order_id, {
      stripe_session_id: session.id,
      payment_status: 'pending',
    } as any);

    return session;
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        return await this.handlePaymentSuccess(event.data.object as Stripe.Checkout.Session);
      case 'checkout.session.expired':
        return await this.handlePaymentExpired(event.data.object as Stripe.Checkout.Session);
      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }
  }

  private async handlePaymentSuccess(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.order_id;
    if (!orderId) return;

    await this.orderRepo.update(orderId, {
      payment_status: 'completed',
      status: 'confirmed',
      payment_intent_id: session.payment_intent as string,
      paid_at: new Date(),
    } as any);
  }

  private async handlePaymentExpired(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.order_id;
    if (!orderId) return;

    await this.orderRepo.update(orderId, {
      payment_status: 'expired',
      status: 'cancelled',
    } as any);
  }
}
