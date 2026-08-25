import { NextResponse } from 'next/server';
import {
  updateContactMessageStatus,
  deleteContactMessage,
  ContactMessageStatus,
} from '@/services/contact.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid message ID.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body || {};

    const validStatuses: ContactMessageStatus[] = [
      'unread',
      'read',
      'replied',
      'archived',
    ];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid status value. Must be unread, read, replied, or archived.',
        },
        { status: 400 }
      );
    }

    const updated = await updateContactMessageStatus(id, status);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Message not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Message status updated to ${status}.`,
    });
  } catch (error: any) {
    console.error('PATCH /api/admin/messages/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update message status.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid message ID.' },
        { status: 400 }
      );
    }

    const deleted = await deleteContactMessage(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Message not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully.',
    });
  } catch (error: any) {
    console.error('DELETE /api/admin/messages/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete message.' },
      { status: 500 }
    );
  }
}
