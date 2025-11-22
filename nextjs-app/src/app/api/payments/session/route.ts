import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';
import { requireAuth } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);

    const body = await request.json();
    const { order_id, amount } = body;

    if (!order_id || !amount) {
      throw new APIError('order_id and amount required', 400);
    }

    const paymentService = new PaymentService();
    const session = await paymentService.createCheckoutSession({
      order_id,
      amount,
      user_id: auth.userId,
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-cancel`,
    });

    return NextResponse.json({
      session_id: session.id,
      url: session.url,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
