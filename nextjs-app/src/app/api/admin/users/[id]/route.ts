import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { UserRepository } from '@/lib/repositories/user.repository';
import { handleAPIError, APIError } from '@/lib/middleware/error-handler';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const userRepo = new UserRepository();
    const user = await userRepo.findById(id);

    if (!user) {
      throw new APIError('User not found', 404);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const userRepo = new UserRepository();

    const updated = await userRepo.update(id, {
      ...body,
      updated_at: new Date(),
    } as any);

    if (!updated) {
      throw new APIError('User not found', 404);
    }

    const { password, ...userWithoutPassword } = updated;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const userRepo = new UserRepository();
    const deleted = await userRepo.delete(id);

    if (!deleted) {
      throw new APIError('User not found', 404);
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return handleAPIError(error);
  }
}
