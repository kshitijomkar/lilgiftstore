import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { token, new_password } = await request.json();
    if (!token || !new_password) {
      return NextResponse.json(
        { error: 'Token and password required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await db
      .collection('password_reset_tokens')
      .findOne({ token_hash: tokenHash, used: false });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    if (new Date() > resetToken.expires_at) {
      return NextResponse.json(
        { error: 'Reset token expired' },
        { status: 400 }
      );
    }

    // Update password
    const hashedPassword = await hashPassword(new_password);
    await db.collection('users').updateOne(
      { _id: resetToken.user_id },
      { $set: { password: hashedPassword, updated_at: new Date() } }
    );

    // Mark token as used
    await db
      .collection('password_reset_tokens')
      .updateOne({ _id: resetToken._id }, { $set: { used: true } });

    return NextResponse.json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Password reset confirm error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
