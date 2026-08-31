import db from '@/lib/db';

export type GetReviewParams = {
  search?: string;
  rating?: number;
  status?: 'pending' | 'approved' | 'rejected';
  productId?: number;
  userId?: number;
};

export type CreateReviewInput = {
  user_id: number;
  product_id: number;
  rating: number;
  title?: string | null;
  comment?: string | null;
  status?: 'pending' | 'approved' | 'rejected';
};

export async function getReviews({
  search,
  rating,
  status,
  productId,
  userId,
}: GetReviewParams = {}) {
  try {
    let sql = `
        SELECT
            r.id,
            r.user_id,
            r.product_id,

            r.rating,
            r.title,
            r.comment,
            r.status,

            r.created_at,
            r.updated_at,

            u.name as customer_name,
            u.email as customer_email,

            p.name as product_name,
            p.slug as product_slug,

            (
                SELECT pi.image_url
                FROM product_images pi
                WHERE pi.product_id = r.product_id
                ORDER BY pi.is_primary DESC, pi.id ASC
                LIMIT 1
            ) as product_image

        FROM reviews r

        LEFT JOIN users u ON u.id = r.user_id
        LEFT JOIN products p ON p.id = r.product_id

        WHERE 1 = 1
    `;

    const params: any[] = [];

    if (search) {
      sql += `
            AND (
                u.name LIKE ?
                OR u.email LIKE ?
                OR p.name LIKE ?
                OR r.title LIKE ?
                OR r.comment LIKE ?
            )
        `;
      const searchValue = `%${search}%`;
      params.push(searchValue, searchValue, searchValue, searchValue, searchValue);
    }

    if (rating) {
      sql += ` AND r.rating = ? `;
      params.push(rating);
    }

    if (status) {
      sql += ` AND r.status = ? `;
      params.push(status);
    }

    if (productId) {
      sql += ` AND r.product_id = ? `;
      params.push(productId);
    }

    if (userId) {
      sql += ` AND r.user_id = ? `;
      params.push(userId);
    }

    sql += ` ORDER BY r.created_at DESC `;

    const [rows] = await db.query(sql, params);
    return rows;
  } catch (error) {
    console.error('getReviews error:', error);
    return [];
  }
}

export async function getReviewById(id: number) {
  const [rows]: any = await db.query(
    `
    SELECT
        r.id,
        r.user_id,
        r.product_id,
        r.rating,
        r.title,
        r.comment,
        r.status,
        r.created_at,
        r.updated_at,
        u.name as customer_name,
        u.email as customer_email,
        p.name as product_name,
        p.slug as product_slug
    FROM reviews r
    LEFT JOIN users u ON u.id = r.user_id
    LEFT JOIN products p ON p.id = r.product_id
    WHERE r.id = ?
    LIMIT 1
  `,
    [id]
  );

  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0];
  }

  return null;
}

export async function createReview(data: CreateReviewInput) {
  const {
    user_id,
    product_id,
    rating,
    title = null,
    comment = null,
    status = 'pending',
  } = data;

  if (rating < 1 || rating > 5) {
    throw new Error('INVALID_RATING');
  }

  // Check if user already submitted a review for this product
  const [existing]: any = await db.query(
    `
    SELECT id FROM reviews
    WHERE user_id = ? AND product_id = ?
    LIMIT 1
  `,
    [user_id, product_id]
  );

  if (Array.isArray(existing) && existing.length > 0) {
    // Update existing review
    const reviewId = existing[0].id;
    const [result] = await db.query(
      `
      UPDATE reviews
      SET rating = ?,
          title = ?,
          comment = ?,
          status = ?
      WHERE id = ?
    `,
      [rating, title || null, comment || null, status, reviewId]
    );
    return result;
  }

  // Insert new review
  const [result] = await db.query(
    `
    INSERT INTO reviews (
        user_id,
        product_id,
        rating,
        title,
        comment,
        status
    ) VALUES (?, ?, ?, ?, ?, ?)
  `,
    [user_id, product_id, rating, title || null, comment || null, status]
  );

  return result;
}

const REVIEW_STATUSES = ['pending', 'approved', 'rejected'] as const;

export async function updateReviewStatus(
  id: number,
  status: 'pending' | 'approved' | 'rejected'
) {
  if (!REVIEW_STATUSES.includes(status)) {
    throw new Error('INVALID_REVIEW_STATUS');
  }

  const [result] = await db.query(
    `
    UPDATE reviews
    SET status = ?
    WHERE id = ?
  `,
    [status, id]
  );

  return result;
}

export async function deleteReview(id: number) {
  const [result] = await db.query(
    `
    DELETE FROM reviews
    WHERE id = ?
  `,
    [id]
  );

  return result;
}

export async function getProductReviews(productId: number) {
  const [rows]: any = await db.query(
    `
    SELECT
        r.id,
        r.rating,
        r.title,
        r.comment,
        r.created_at,
        u.name as customer_name
    FROM reviews r
    LEFT JOIN users u ON u.id = r.user_id
    WHERE r.product_id = ? AND r.status = 'approved'
    ORDER BY r.created_at DESC
  `,
    [productId]
  );

  return rows;
}