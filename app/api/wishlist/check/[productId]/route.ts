import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

type Params = {
  params: Promise<{
    productId: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({
        success: true,
        data: {
          isWishlisted: false,
        },
      });
    }

    const { productId } = await params;
    const userId = Number(session.user.id);
    const productNumber = Number(productId);

    const [rows]: any = await db.query(
      `
      select id
      from wishlist
      where user_id = ?
        and product_id = ?
      limit 1
      `,
      [userId, productNumber]
    );

    return NextResponse.json({
      success: true,
      data: {
        isWishlisted: Array.isArray(rows) && rows.length > 0,
      },
    });
  } catch (error) {
    console.error('Wishlist check error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check wishlist',
      },
      {
        status: 500,
      }
    );
  }
}