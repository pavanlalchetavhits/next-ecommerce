import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCustomerOrderHistory } from '@/services/user.service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
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

    const orders = await getCustomerOrderHistory(userId);

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    console.error('Fetch customer order history error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch customer order history' },
      { status: 500 }
    );
  }
}
