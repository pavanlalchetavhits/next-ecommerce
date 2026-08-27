import { NextResponse } from 'next/server';
import { createPasswordResetLink } from '@/services/user.service';
import { forgotPasswordSchema } from '@/lib/validations/user';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse({ email: body.email });

    const origin = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const result = await createPasswordResetLink(validatedData.email, body.role, origin);

    // Dispatch email template using lib/email.ts
    const emailResult = await sendPasswordResetEmail(result.email, result.resetLink);

    if (!emailResult.success) {
      console.warn('Password reset email delivery note:', emailResult);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'A password reset link valid for 10 minutes has been sent to your registered email address.',
        data: {
          email: result.email,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Forgot password error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email address.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to process password reset request.',
      },
      { status: error.message?.includes('No account') ? 404 : 500 }
    );
  }
}