import { Cashfree, CFEnvironment } from "cashfree-pg";

const environment =
  process.env.CASHFREE_ENVIRONMENT === "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

const appId = process.env.CASHFREE_APP_ID || "";
const secretKey = process.env.CASHFREE_SECRET_KEY || "";

export const isCashfreeConfigured =
  Boolean(appId && secretKey) &&
  !appId.includes("your_sandbox") &&
  !secretKey.includes("your_sandbox") &&
  !appId.includes("placeholder") &&
  !secretKey.includes("placeholder");

export const cashfree = new Cashfree(environment, appId, secretKey);

export default cashfree;