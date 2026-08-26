import dotenv from 'dotenv';
dotenv.config();

import { Cashfree, CFEnvironment } from 'cashfree-pg';

console.log("CASHFREE_APP_ID:", process.env.CASHFREE_APP_ID);
console.log("CASHFREE_SECRET_KEY:", process.env.CASHFREE_SECRET_KEY ? "EXISTS" : "MISSING");

const environment = process.env.CASHFREE_ENVIRONMENT === "production" ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;

const cashfree = new Cashfree(environment, process.env.CASHFREE_APP_ID, process.env.CASHFREE_SECRET_KEY);

const requestData = {
  order_amount: 100.00,
  order_currency: "INR",
  order_id: `NEX_TEST_${Date.now()}`,
  customer_details: {
    customer_id: "cust_1",
    customer_name: "Pavan Lalcheta",
    customer_email: "test@example.com",
    customer_phone: "9999999999",
  },
  order_meta: {
    return_url: "http://localhost:3000/api/payments/cashfree/verify?order_id=1&cf_order_id={order_id}",
  },
};

try {
  console.log("Creating Cashfree Order with PGCreateOrder...");
  const res1 = await cashfree.PGCreateOrder(requestData);
  console.log("SUCCESS with 1 param PGCreateOrder:", res1.data);
} catch (err1) {
  console.error("FAIL with 1 param PGCreateOrder:", err1?.response?.data || err1.message);
  try {
    console.log("Trying PGCreateOrder with version string...");
    const res2 = await cashfree.PGCreateOrder("2023-08-01", requestData);
    console.log("SUCCESS with version PGCreateOrder:", res2.data);
  } catch (err2) {
    console.error("FAIL with version PGCreateOrder:", err2?.response?.data || err2.message);
  }
}
