import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/services/setting.service';

export async function GET() {
  try {
    const settings = await getSettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid payload' },
        { status: 400 }
      );
    }

    await updateSettings(body);

    return NextResponse.json({
      success: true,
      message: 'Store settings updated successfully',
    });
  } catch (error) {
    console.error('PUT /api/settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return PUT(request);
}
