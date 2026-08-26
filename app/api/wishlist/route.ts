import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

export async function GET() {
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

    const userId = Number(session.user.id);

    const [rows] = await db.query(
      `
      select
          w.id,
          w.product_id,
          w.created_at,
          
          p.name,
          p.slug,
          p.price,
          p.compare_at_price,
          p.sku,
          COALESCE((select sum(quantity) from inventory where product_id = p.id), 0) as stock_quantity,

          (
              select pi.image_url
              from product_images pi
              where pi.product_id = p.id
              order by pi.is_primary desc, pi.sort_order asc, pi.id asc
              limit 1
          ) as main_image

      from wishlist w

      inner join products p
          on p.id = w.product_id

      where w.user_id = ?

      order by w.created_at desc
      `,
      [userId]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Wishlist GET error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch wishlist',
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please login to use wishlist',
        },
        {
          status: 401,
        }
      );
    }

    const userId = Number(session.user.id);
    const body = await request.json();
    const productId = Number(body.product_id);

    if (!Number.isInteger(productId) || productId <= 0) {
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

    const [products]: any = await db.query(
      `
      select id
      from products
      where id = ?
      limit 1    
      `,
      [productId]
    );

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        {
          status: 404,
        }
      );
    }

    const [existing]: any = await db.query(
      `
      select id
      from wishlist
      where user_id = ?
        and product_id = ?
      limit 1    
      `,
      [userId, productId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Product already in wishlist',
      });
    }

    const [result]: any = await db.query(
      `
      insert into wishlist (user_id, product_id)
      values (?, ?)    
      `,
      [userId, productId]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Added to wishlist',
        data: {
          id: result.insertId,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('Wishlist POST error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to add to wishlist',
      },
      {
        status: 500,
      }
    );
  }
}