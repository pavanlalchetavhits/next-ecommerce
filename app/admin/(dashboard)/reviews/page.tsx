import { getReviews } from '@/services/review.service';
import ReviewManager, { ReviewItem } from '@/components/admin/ReviewManager';

export const revalidate = 0;

export default async function AdminReviewsPage() {
  const reviewsRaw: any = await getReviews({});

  const reviews: ReviewItem[] = (reviewsRaw || []).map((r: any) => ({
    id: Number(r.id),
    user_id: Number(r.user_id),
    product_id: Number(r.product_id),
    rating: Number(r.rating || 5),
    title: r.title || null,
    comment: r.comment || null,
    status: r.status || 'pending',
    created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    customer_name: r.customer_name || 'Customer',
    customer_email: r.customer_email || null,
    product_name: r.product_name || 'Product',
    product_slug: r.product_slug || null,
    product_image: r.product_image || null,
  }));

  return <ReviewManager reviews={reviews} />;
}
