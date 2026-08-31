import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/services/user.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ isBlocked: false });
    }

    const user = await findUserByEmail(email);
    if (user && user.status !== 'active') {
      return NextResponse.json({
        isBlocked: true,
        status: user.status,
        message: 'Your account has been blocked by the administrator. Please contact customer support.',
      });
    }

    return NextResponse.json({ isBlocked: false });
  } catch (error) {
    return NextResponse.json({ isBlocked: false });
  }
}
