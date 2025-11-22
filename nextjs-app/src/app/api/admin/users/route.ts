import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50');
    const skip = parseInt(req.nextUrl.searchParams.get('skip') || '0');

    const db = await getDatabase();
    const users = await db.collection('users')
      .find({})
      .project({ password: 0 })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('users').countDocuments({});

    return NextResponse.json({ 
      users: users.map((u: any) => ({
        id: u._id?.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        created_at: u.created_at
      })),
      total,
      page: skip / limit + 1
    });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user_id } = await req.json();
    const db = await getDatabase();

    const result = await db.collection('users').deleteOne({
      _id: new ObjectId(user_id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('User delete error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
