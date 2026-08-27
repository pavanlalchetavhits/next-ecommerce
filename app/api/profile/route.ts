import { NextResponse } from "next/server";
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
          id,
          name,
          email,
          phone,
          role,
          status,
          last_login_at,
          created_at
      from users
      where id = ?
      limit 1
      `,
      [userId]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: users[0],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Profile GET Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch profile',
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: Request) {
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
    const body = await request.json();

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Full Name is required',
        },
        {
          status: 400,
        }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: 'Full Name must be at least 2 characters',
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: 'Full Name cannot exceed 50 characters',
        },
        {
          status: 400,
        }
      );
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Full Name can only contain letters and spaces',
        },
        {
          status: 400,
        }
      );
    }

    if (phone && (!/^\d+$/.test(phone) || phone.length > 10)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Phone number cannot exceed 10 digits',
        },
        {
          status: 400,
        }
      );
    }

    await db.query(
      `
      update users
      set
          name = ?,
          phone = ?
      where id = ?
      `,
      [name, phone || null, userId]
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Profile PUT error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update profile',
      },
      {
        status: 500,
      }
    );
  }
}