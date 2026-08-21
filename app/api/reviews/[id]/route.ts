import { NextResponse } from 'next/server';
import {
  getReviewById,
  updateReviewStatus,
  deleteReview,
} from '@/services/review.service';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const reviewId = Number(id);

    if (!Number.isInteger(reviewId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 }
      );
    }

    const review = await getReviewById(reviewId);

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('GET /api/reviews/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch review details' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const reviewId = Number(id);

    if (!Number.isInteger(reviewId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Status must be pending, approved, or rejected' },
        { status: 400 }
      );
    }

    await updateReviewStatus(reviewId, status);

    return NextResponse.json({
      success: true,
      message: `Review status updated to "${status}"`,
    });
  } catch (error: any) {
    console.error('PATCH /api/reviews/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update review status' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const reviewId = Number(id);

    if (!Number.isInteger(reviewId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 }
      );
    }

    await deleteReview(reviewId);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/reviews/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
