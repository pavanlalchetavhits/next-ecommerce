import { NextResponse } from "next/server";
import { cashfree, isCashfreeConfigured } from "@/lib/cashfree";
import { getOrderById } from "@/services/order.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // Fetch order details from database
    const order = await getOrderById(Number(orderId));
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    const cfOrderId = `NEX_${orderId}_${Date.now()}`;
    
    // Sanitize phone number (strictly 10 digits for Cashfree India PG)
    let phone = (order.shipping_phone || "9999999999").replace(/[^0-9]/g, "");
    if (phone.length > 10) phone = phone.slice(-10);
    if (phone.length < 10) phone = "9999999999";

    const customerEmail =
      order.customer_email && order.customer_email.includes("@")
        ? order.customer_email
        : "customer@example.com";

    const requestData = {
      order_amount: Math.round(Number(order.total_amount) * 100) / 100,
      order_currency: "INR",
      order_id: cfOrderId,
      customer_details: {
        customer_id: `cust_${order.user_id || 1}`,
        customer_name: (order.shipping_full_name || order.customer_name || "Customer").trim(),
        customer_email: customerEmail.trim(),
        customer_phone: phone,
      },
      order_meta: {
        return_url: `${origin}/api/payments/cashfree/verify?order_id=${orderId}&cf_order_id={order_id}`,
      },
    };

    if (isCashfreeConfigured) {
      try {
        const response = await cashfree.PGCreateOrder(requestData);
        if (response?.data?.payment_session_id) {
          return NextResponse.json({
            success: true,
            orderId: orderId,
            cfOrderId: response.data.order_id || cfOrderId,
            paymentSessionId: response.data.payment_session_id,
            isDemo: false,
          });
        }
      } catch (cfErr: any) {
        console.error("Cashfree API error:", cfErr?.response?.data || cfErr?.message || cfErr);
      }
    }

    // Demo / Simulation Fallback if Cashfree credentials are not configured or API fails
    return NextResponse.json({
      success: true,
      orderId: orderId,
      cfOrderId: cfOrderId,
      paymentSessionId: `demo_session_${orderId}_${Date.now()}`,
      isDemo: true,
      message: "Cashfree API key not configured or sandbox unavailable; using demo mode.",
    });
  } catch (error: any) {
    console.error("Cashfree order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Unable to create payment session",
      },
      {
        status: 500,
      }
    );
  }
}