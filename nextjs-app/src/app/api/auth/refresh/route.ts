import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      throw new APIError('Refresh token required', 400);
    }

    // For now, just generate a new token from the body
    // In production, verify refresh token signature
    const token = generateToken(refresh_token);

    return NextResponse.json({ token });
  } catch (error) {
    return handleAPIError(error);
  }
}
