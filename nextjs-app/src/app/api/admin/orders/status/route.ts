import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { getDatabase } from '@/lib/db';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';
import { emailService } from '@/lib/services/email.service';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const status = request.nextUrl.searchParams.get('status');
    const db = await getDatabase();

    const query = status ? { status } : {};
    const orders = await db.collection('orders').find(query).toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const { order_id, status } = body;

    if (!order_id || !status) {
      throw new APIError('order_id and status required', 400);
    }

    const db = await getDatabase();
    const updated = await db.collection('orders').findOneAndUpdate(
      { _id: new ObjectId(order_id) },
      {
        $set: {
          status,
          updated_at: new Date(),
        },
        $push: {
          timeline: { status, timestamp: new Date() }
        }
      },
      { returnDocument: 'after' }
    );

    // Send status update email
    if (updated.value) {
      try {
        const user = await db.collection('users').findOne({ _id: updated.value.user_id });
        if (user?.email) {
          await emailService.sendOrderStatusUpdate(user.email, order_id, status);
        }
      } catch (emailError) {
        console.error("Status update email failed:", emailError);
      }
    }

    return NextResponse.json(updated.value);
  } catch (error) {
    return handleAPIError(error);
  }
}
