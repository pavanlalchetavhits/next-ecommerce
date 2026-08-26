import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cashfree, isCashfreeConfigured } from "@/lib/cashfree";
import { getOrderById } from "@/services/order.service";
import { createPaymentTransaction } from "@/services/payment.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderIdParam = searchParams.get("order_id");
    const cfOrderIdParam = searchParams.get("cf_order_id");
    const demoParam = searchParams.get("demo");

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    if (!orderIdParam) {
      return NextResponse.redirect(`${baseUrl}/checkout?error=Missing+order+ID`);
    }

    const orderId = Number(orderIdParam);
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.redirect(`${baseUrl}/checkout?error=Order+not+found`);
    }

    let isPaid = false;

    // Handle Demo / Simulation Mode
    if (demoParam === "true" || !isCashfreeConfigured) {
      isPaid = true;
    } else if (cfOrderIdParam) {
      try {
        const response = await cashfree.PGFetchOrder(cfOrderIdParam);
        const status = response?.data?.order_status;
        if (status === "PAID") {
          isPaid = true;
        }
      } catch (cfErr: any) {
        console.error("Cashfree verify error:", cfErr?.response?.data || cfErr?.message || cfErr);
      }
    }

    if (isPaid) {
      // 1. Update order status in DB
      await db.query(
        `UPDATE orders SET payment_status = 'paid', status = 'confirmed' WHERE id = ?`,
        [orderId]
      );

      // 2. Insert transaction into payments table
      await createPaymentTransaction({
        order_id: orderId,
        payment_gateway: "cashfree",
        payment_id: cfOrderIdParam || `CF_${orderId}_${Date.now()}`,
        order_reference: `REF_${order.order_number}`,
        amount: Number(order.total_amount),
        status: "success",
        payment_method: "online_upi",
        gateway_response: {
          gateway: "cashfree",
          cf_order_id: cfOrderIdParam,
          verified_at: new Date().toISOString(),
        },
      });

      return NextResponse.redirect(`${baseUrl}/order-success/${orderId}?payment=success`);
    } else {
      await db.query(
        `UPDATE orders SET payment_status = 'failed' WHERE id = ?`,
        [orderId]
      );

      const failureReason = encodeURIComponent("Payment verification failed or payment was cancelled by user.");
      return NextResponse.redirect(`${baseUrl}/order-failed/${orderId}?reason=${failureReason}`);
    }
  } catch (error: any) {
    console.error("Cashfree verification handler error:", error);
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    return NextResponse.redirect(`${protocol}://${host}/checkout?error=Payment+verification+error`);
  }
}
