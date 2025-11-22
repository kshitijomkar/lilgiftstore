import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { getDatabase } from '@/lib/db';
import { handleAPIError } from '@/lib/middleware/error-handler';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const db = await getDatabase();

    const history = await db
      .collection('orders')
      .find({
        user_id: user.id,
        payment_status: { $in: ['completed', 'failed'] },
      })
      .sort({ created_at: -1 })
      .project({
        id: 1,
        total_amount: 1,
        payment_status: 1,
        paid_at: 1,
        payment_error: 1,
        created_at: 1,
      })
      .toArray();

    return NextResponse.json({ history });
  } catch (error) {
    return handleAPIError(error);
  }
}
