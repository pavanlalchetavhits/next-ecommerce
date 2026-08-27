import { NextResponse } from 'next/server';
import { resetUserPasswordWithToken } from '@/services/user.service';
import { resetPasswordSchema } from '@/lib/validations/user';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);

    await resetUserPasswordWithToken(
      validatedData.email,
      validatedData.token,
      validatedData.newPassword
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset successfully. You can now sign in with your new password.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Reset password error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed. Please check the entered fields.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Password reset failed.',
      },
      { status: 400 }
    );
  }
}