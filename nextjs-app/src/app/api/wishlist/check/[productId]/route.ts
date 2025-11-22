import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const auth = requireAuth(req);
    if ('error' in auth) {
      return NextResponse.json({ in_wishlist: false });
    }

    const { productId } = await params;
    const db = await getDatabase();

    const exists = await db.collection('wishlists').findOne({
      user_id: auth.user.id,
      product_id: productId,
    });

    return NextResponse.json({ in_wishlist: !!exists });
  } catch (error) {
    return NextResponse.json({ in_wishlist: false });
  }
}
