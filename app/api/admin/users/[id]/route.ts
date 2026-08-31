import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updateCustomerStatus } from '@/services/user.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = Number(id);
    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['active', 'blocked', 'suspended'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value. Must be active, blocked, or suspended.' },
        { status: 400 }
      );
    }

    await updateCustomerStatus(userId, status);

    return NextResponse.json({
      success: true,
      message: `Customer account status updated to ${status}`,
    });
  } catch (error: any) {
    console.error('Update customer status error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update customer status' },
      { status: 500 }
    );
  }
}
