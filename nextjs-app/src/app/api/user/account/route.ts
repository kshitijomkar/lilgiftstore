import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { password } = await request.json();
    if (!password) {
      return NextResponse.json(
        { error: 'Password required to delete account' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const user = await db.collection('users').findOne({
      _id: new ObjectId(auth.user.id),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const passwordValid = await verifyPassword(password, user.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Delete user and all related data
    const userId = auth.user.id;
    await Promise.all([
      db.collection('users').deleteOne({ _id: new ObjectId(userId) }),
      db.collection('cart').deleteMany({ user_id: userId }),
      db.collection('wishlists').deleteMany({ user_id: userId }),
      db.collection('addresses').deleteMany({ user_id: userId }),
      db.collection('custom_gifts').updateMany(
        { user_id: userId },
        { $set: { user_id: null, anonymized: true } }
      ),
      db.collection('reviews').updateMany(
        { user_id: userId },
        { $set: { user_id: null, user_name: 'Anonymous' } }
      ),
      db.collection('contacts').updateMany(
        { user_id: userId },
        { $set: { user_id: null, anonymized: true } }
      ),
      db.collection('orders').updateMany(
        { user_id: userId },
        { $set: { status: 'archived' } }
      ),
    ]);

    return NextResponse.json({
      message: 'Account deleted successfully',
      archived_orders: true,
      anonymized_reviews: true,
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
