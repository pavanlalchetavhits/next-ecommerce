import { NextResponse } from 'next/server';
import { getContactMessages } from '@/services/contact.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await getContactMessages({
      status,
      search,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.messages,
      pagination: result.pagination,
      stats: result.stats,
    });
  } catch (error: any) {
    console.error('GET /api/admin/messages error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch contact messages.',
      },
      { status: 500 }
    );
  }
}
