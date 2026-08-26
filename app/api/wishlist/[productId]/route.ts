import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

type Params = {
  params: Promise<{
    productId: string;
  }>;
};

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    const { productId } = await params;
    const userId = Number(session.user.id);
    const productNumber = Number(productId);

    if (!Number.isInteger(productNumber) || productNumber <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid product id',
        },
        {
          status: 400,
        }
      );
    }

    await db.query(
      `
      delete from wishlist
      where user_id = ?
        and product_id = ?    
      `,
      [userId, productNumber]
    );

    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist',
    });
  } catch (error) {
    console.error('Wishlist delete error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to remove from wishlist',
      },
      {
        status: 500,
      }
    );
  }
}
