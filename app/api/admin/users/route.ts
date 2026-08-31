import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAdminCustomers } from '@/services/user.service';

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';

    const result = await getAdminCustomers({
      page,
      limit,
      search,
      status,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      summary: result.summary,
    });
  } catch (error: any) {
    console.error('Fetch admin customers error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch customer list' },
      { status: 500 }
    );
  }
}
