import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const db = await getDatabase();
    const addresses = await db.collection('addresses')
      .find({ user_id: auth.user.id })
      .toArray();

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('Addresses fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { street, city, state, zipcode, country, isDefault } = await req.json();
    const db = await getDatabase();

    if (isDefault) {
      await db.collection('addresses').updateMany(
        { user_id: auth.user.id },
        { $set: { is_default: false } }
      );
    }

    const result = await db.collection('addresses').insertOne({
      user_id: auth.user.id,
      street,
      city,
      state,
      zipcode,
      country,
      is_default: isDefault || false,
      created_at: new Date(),
    });

    return NextResponse.json({ 
      id: result.insertedId.toString(),
      message: 'Address added successfully' 
    });
  } catch (error) {
    console.error('Address creation error:', error);
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
}
