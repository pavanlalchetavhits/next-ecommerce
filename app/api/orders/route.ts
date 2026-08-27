import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrders, createOrder } from "@/services/order.service";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const paymentStatus = searchParams.get("paymentStatus") || undefined;
    const reqUserId = searchParams.get("userId") || undefined;

    let targetUserId: number | undefined = undefined;

    if (session?.user) {
      if (session.user.role === 'admin') {
        targetUserId = reqUserId ? Number(reqUserId) : undefined;
      } else {
        // Enforce user-wise filtering for logged in customers
        targetUserId = Number(session.user.id);
      }
    } else if (reqUserId) {
      targetUserId = Number(reqUserId);
    }

    const orders = await getOrders({
      search,
      status,
      paymentStatus,
      userId: targetUserId,
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
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

    if (!session || !session.user || !(session.user as any)?.id) {
      return NextResponse.json(
        { success: false, message: 'Please sign in to place an order.' },
        { status: 401 }
      );
    }

    const userId = Number((session.user as any).id);
    const body = await request.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart items are required to place an order.' },
        { status: 400 }
      );
    }

    const orderResult = await createOrder({
      user_id: userId,
      ...body,
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: orderResult,
    });
  } catch (error: any) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}