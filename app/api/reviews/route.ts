import { NextResponse } from 'next/server';
import { getReviews, createReview } from '@/services/review.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || undefined;
    const ratingParams = searchParams.get('rating');
    const rating = ratingParams ? Number(ratingParams) : undefined;
    const status = searchParams.get('status') as
      | 'pending'
      | 'approved'
      | 'rejected'
      | null;
    const productIdParams = searchParams.get('productId');
    const productId = productIdParams ? Number(productIdParams) : undefined;
    const userIdParams = searchParams.get('userId');
    const userId = userIdParams ? Number(userIdParams) : undefined;

    if (
      rating !== undefined &&
      (!Number.isInteger(rating) || rating < 1 || rating > 5)
    ) {
      return NextResponse.json(
        { success: false, message: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    const reviews = await getReviews({
      search,
      rating,
      status: status || undefined,
      productId,
      userId,
    });

    return NextResponse.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { user_id, product_id, rating, title, comment, status } = body;

    const userId = Number(user_id);
    const productId = Number(product_id);
    const numRating = Number(rating);

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: 'Valid user_id is required' },
        { status: 400 }
      );
    }

    if (!productId || isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: 'Valid product_id is required' },
        { status: 400 }
      );
    }

    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5 stars' },
        { status: 400 }
      );
    }

    await createReview({
      user_id: userId,
      product_id: productId,
      rating: numRating,
      title: title?.trim() || null,
      comment: comment?.trim() || null,
      status: status && ['pending', 'approved', 'rejected'].includes(status)
        ? status
        : 'pending',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Review submitted successfully and is pending moderation',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit review' },
      { status: 500 }
    );
  }
}