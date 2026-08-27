import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updateUserAddress, deleteUserAddress } from '@/services/address.service';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id || 1;
    const { id } = await params;
    const addressId = Number(id);

    if (!Number.isInteger(addressId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid address ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    if (
      !body.full_name ||
      !body.phone ||
      !body.address_line1 ||
      !body.city ||
      !body.state ||
      !body.postal_code
    ) {
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

    const updated = await updateUserAddress(addressId, Number(userId), body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Address not found or not modified.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
    });
  } catch (error: any) {
    console.error('PUT /api/addresses/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update address' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id || 1;
    const { id } = await params;
    const addressId = Number(id);

    if (!Number.isInteger(addressId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid address ID' },
        { status: 400 }
      );
    }

    const deleted = await deleteUserAddress(addressId, Number(userId));
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Address not found or already deleted.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error: any) {
    console.error('DELETE /api/addresses/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
