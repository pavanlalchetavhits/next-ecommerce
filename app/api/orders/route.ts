import { NextResponse } from "next/server";

import {
  getOrders,
} from "@/services/order.service";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams.get("search") ||
      undefined;

    const status =
      searchParams.get("status") ||
      undefined;

    const paymentStatus =
      searchParams.get("paymentStatus") ||
      undefined;

    const orders = await getOrders({
      search,
      status,
      paymentStatus,
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

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