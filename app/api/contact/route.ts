import { NextResponse } from 'next/server';
import { createContactMessage } from '@/services/contact.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body || {};

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Required fields missing (name, email, subject, message).',
        },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email address provided.',
        },
        { status: 400 }
      );
    }

    const newMessage = await createContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit contact message. Please try again.',
      },
      { status: 500 }
    );
  }
}
