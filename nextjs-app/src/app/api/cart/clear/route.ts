import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { handleAPIError } from '@/lib/middleware/error-handler';

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const db = await getDatabase();
    await db.collection('cart').deleteMany({ session_id: sessionId });

    return NextResponse.json({ message: 'Cart cleared' });
  } catch (error) {
    return handleAPIError(error);
  }
}
