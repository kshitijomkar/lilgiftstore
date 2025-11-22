import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { emailService } from '@/lib/services/email.service';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const db = await getDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: 'If email exists, reset link sent (privacy)' },
        { status: 200 }
      );
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.collection('password_reset_tokens').insertOne({
      user_id: user._id,
      email,
      token_hash: resetTokenHash,
      expires_at: expiresAt,
      used: false,
      created_at: new Date(),
    });

    const resetLink = `${process.env.NEXT_PUBLIC_DOMAIN}/reset-password?token=${resetToken}`;

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(email, resetLink);
    } catch (emailError) {
      console.error("Password reset email failed:", emailError);
    }

    return NextResponse.json({
      message: 'Password reset email sent (check spam)',
      reset_link: process.env.NODE_ENV === 'development' ? resetLink : undefined,
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process reset request' },
      { status: 500 }
    );
  }
}
