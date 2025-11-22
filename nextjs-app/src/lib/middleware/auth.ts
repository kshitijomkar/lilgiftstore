import { NextRequest } from 'next/server';
import { verifyToken, UserPayload } from '@/lib/auth';
import { APIError } from './error-handler';

export function requireAuth(request: NextRequest): UserPayload {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new APIError('No authorization token', 401);
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  
  if (!decoded) {
    throw new APIError('Invalid or expired token', 401);
  }

  return decoded;
}

export function requireAdmin(request: NextRequest): UserPayload {
  const user = requireAuth(request);
  
  if (user.role !== 'admin') {
    throw new APIError('Admin access required', 403);
  }

  return user;
}
