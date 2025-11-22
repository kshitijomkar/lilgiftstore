import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const auth = requireAuth(req);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { street, city, state, zipcode, country, isDefault } = await req.json();
    const db = await getDatabase();

    if (isDefault) {
      await db.collection('addresses').updateMany(
        { user_id: auth.user.id, _id: { $ne: new ObjectId(id) } },
        { $set: { is_default: false } }
      );
    }

    const result = await db.collection('addresses').updateOne(
      { _id: new ObjectId(id), user_id: auth.user.id },
      { $set: { street, city, state, zipcode, country, is_default: isDefault } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Address updated successfully' });
  } catch (error) {
    console.error('Address update error:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = requireAuth(req);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const db = await getDatabase();
    const result = await db.collection('addresses').deleteOne({
      _id: new ObjectId(id),
      user_id: auth.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Address delete error:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
