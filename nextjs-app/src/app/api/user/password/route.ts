import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { UserService } from '@/lib/services/user.service';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';

export async function PUT(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const body = await request.json();
    const { old_password, new_password } = body;

    if (!old_password || !new_password) {
      throw new APIError('Old and new passwords required', 400);
    }

    const userService = new UserService();
    await userService.updatePassword(user.id, old_password, new_password);

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    return handleAPIError(error);
  }
}
