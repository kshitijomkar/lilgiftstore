import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { getDatabase } from '@/lib/db';
import { handleAPIError } from '@/lib/middleware/error-handler';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const db = await getDatabase();

    const gifts = await db.collection('custom_gifts').find({}).toArray();

    return NextResponse.json({ gifts });
  } catch (error) {
    return handleAPIError(error);
  }
}
