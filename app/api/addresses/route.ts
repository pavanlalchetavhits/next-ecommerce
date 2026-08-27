import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserAddresses, createUserAddress } from '@/services/address.service';

export async function GET() {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id || 1; // Fallback to user ID 1 if session is active

    const addresses = await getUserAddresses(Number(userId));
    return NextResponse.json({
      success: true,
      data: addresses,
    });
  } catch (error: any) {
    console.error('GET /api/addresses error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id || 1;

    const body = await request.json();
    if (!body.full_name || !body.phone || !body.address_line1 || !body.city || !body.state || !body.postal_code) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required address fields.' },
        { status: 400 }
      );
    }

    const fullName = String(body.full_name).trim();
    const phone = String(body.phone).trim();
    const postalCode = String(body.postal_code).trim();

    if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      return NextResponse.json(
        { success: false, message: 'Full Name can only contain letters and spaces.' },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'Phone number must contain exactly 10 digits.' },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(postalCode)) {
      return NextResponse.json(
        { success: false, message: 'Postal code must contain exactly 6 digits.' },
        { status: 400 }
      );
    }

    if (body.address_line1 && String(body.address_line1).trim().length > 500) {
      return NextResponse.json(
        { success: false, message: 'Address Line 1 cannot exceed 500 characters.' },
        { status: 400 }
      );
    }

    if (body.address_line2 && String(body.address_line2).trim().length > 500) {
      return NextResponse.json(
        { success: false, message: 'Address Line 2 cannot exceed 500 characters.' },
        { status: 400 }
      );
    }

    const insertId = await createUserAddress(Number(userId), body);
    return NextResponse.json({
      success: true,
      message: 'Address saved successfully',
      data: { id: insertId, ...body },
    });
  } catch (error: any) {
    console.error('POST /api/addresses error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save address' },
      { status: 500 }
    );
  }
}
