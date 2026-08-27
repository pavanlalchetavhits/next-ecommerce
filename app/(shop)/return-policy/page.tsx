import PolicyPage, { PolicyHighlight } from '@/components/ui/PolicyPage';
import { RotateCcw, CreditCard, ShieldCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ReturnPolicyPage() {
  const highlights: PolicyHighlight[] = [
    {
      icon: <RotateCcw className="w-5 h-5" />,
      title: '30-Day Return Window',
      description: 'Return eligible items in original condition within 30 days of receiving your order.',
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Prompt Refunds',
      description: 'Refunds credited back to original payment method or store credit within 5-7 business days.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: 'Free Defect Exchanges',
      description: 'Damaged or wrong items are replaced immediately with zero extra shipping charges.',
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: 'Self-Service Returns',
      description: 'Initiate returns easily through your NexCart user profile order dashboard.',
    },
  ];

  return (
    <PolicyPage
      activePolicy="returns"
      title="Return & Refund Policy"
      description="We stand by the quality of our products. If you are not entirely satisfied with your purchase, our Return & Refund Policy makes returning items simple, transparent, and fair."
      lastUpdated="27 August 2026"
      version="v2.4"
      readTime="6 min read"
      highlights={highlights}
      sections={[
        {
          title: '1. Return Window & Eligibility Overview',
          summaryNote: 'Items in unused condition with original tags and packaging are eligible for return within 30 calendar days of delivery.',
          content: (
            <>
              <p>
                You may request a return for most items purchased on NexCart within <strong>30 calendar days</strong> from the date your package was delivered.
              </p>
              <p className="mt-2">
                To be eligible for a full refund or exchange, returned items must meet the following criteria:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Unused, unworn, unwashed, and in the same condition as received.</li>
                <li>In original packaging with all brand tags, seals, accessories, and manuals intact.</li>
                <li>Accompanied by proof of purchase (Order ID or invoice receipt).</li>
              </ul>
            </>
          ),
        },
        {
          title: '2. Non-Returnable & Final Sale Items',
          summaryNote: 'Perishable goods, personalized items, clearanced final sale merchandise, and intimate hygiene products cannot be returned.',
          content: (
            <>
              <p>For health, hygiene, safety, and customization reasons, certain categories are non-returnable:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Customized or personalized products made to user specification.</li>
                <li>Perishable items (food, beverages, flowers, cosmetics with broken security seals).</li>
                <li>Intimate apparel, swimwear, and personal care accessories once opened.</li>
                <li>Downloadable digital software licenses and gift cards.</li>
                <li>Items explicitly marked as &quot;Final Sale&quot; or &quot;Non-Returnable&quot; on the product page.</li>
              </ul>
            </>
          ),
        },
        {
          title: '3. How to Initiate a Return Request',
          summaryNote: 'Request returns in 3 easy steps via your Account Dashboard or by contacting customer support.',
          content: (
            <>
              <p>Initiating a return on NexCart is quick and self-service:</p>
              <ol className="list-decimal pl-5 space-y-2 mt-2">
                <li>
                  <strong>Log in to your Account:</strong> Go to your{' '}
                  <Link href="/profile" className="text-indigo-600 dark:text-indigo-400 font-bold underline">
                    My Profile & Orders
                  </Link>{' '}
                  page.
                </li>
                <li>
                  <strong>Select Order & Item:</strong> Choose the delivered order, click &quot;Return Item&quot;, and select your return reason.
                </li>
                <li>
                  <strong>Print Return Label:</strong> Download the generated prepaid shipping label and attach it securely to your return package.
                </li>
              </ol>
            </>
          ),
        },
        {
          title: '4. Quality Inspection & Return Approval',
          summaryNote: 'Returned items undergo quality inspection at our fulfillment warehouse before refund authorization.',
          content: (
            <>
              <p>
                Once your return package arrives at our processing center, our quality control team will inspect the item within <strong>48 hours</strong> to verify its condition against our return criteria.
              </p>
              <p className="mt-2">
                Upon approval, you will receive an automated email confirmation confirming that your refund or exchange has been initiated.
              </p>
            </>
          ),
        },
        {
          title: '5. Return Shipping Fees & Pickup Logistics',
          summaryNote: 'Free return shipping is provided for defective items or store error. Customer-preference returns may incur a small return courier fee.',
          content: (
            <>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200">
                  <span className="font-bold">Defective / Damaged Item Returns: </span>
                  Return shipping is 100% free! NexCart covers all pickup and freight charges.
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold">Size Change / Mind-Change Returns: </span>
                  A standard nominal pickup fee (typically ₹50 - ₹100 or local equivalent) will be deducted from your final refund total.
                </div>
              </div>
            </>
          ),
        },
        {
          title: '6. Refund Processing & Payment Method Timelines',
          summaryNote: 'Approved refunds are credited within 5 to 7 business days depending on your payment provider.',
          content: (
            <>
              <p>Refunds are issued based on your original payment method selected during checkout:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Credit/Debit Cards:</strong> 5 to 7 business days to reflect on bank statements.</li>
                <li><strong>UPI & Net Banking:</strong> 24 to 48 hours directly into your bank account.</li>
                <li><strong>Cash on Delivery (COD):</strong> Refunded via direct UPI transfer or NexCart Store Credit code within 3 business days of return pickup.</li>
                <li><strong>Store Credit / Gift Balance:</strong> Instant credit to your NexCart wallet upon approval.</li>
              </ul>
            </>
          ),
        },
        {
          title: '7. Damaged, Defective, or Wrong Item Claims',
          summaryNote: 'Report damaged or incorrectly delivered items within 48 hours of delivery for immediate expedited replacement.',
          content: (
            <>
              <p>
                If your order arrives damaged, defective, or missing components, please notify us within <strong>48 hours</strong> of delivery.
              </p>
              <p className="mt-2">
                Upload clear photos or a quick unboxing video through your order support ticket. We will immediately dispatch an expedited replacement at zero cost to you.
              </p>
            </>
          ),
        },
        {
          title: '8. Exchanges & Size Replacement Policy',
          summaryNote: 'Need a different size or color? Exchange requests are fulfilled subject to stock availability.',
          content: (
            <>
              <p>
                If you wish to exchange an item for a different size or color, request an exchange on your order page. If the requested replacement variant is in stock, we will ship the replacement item immediately upon receiving the original product back.
              </p>
            </>
          ),
        },
        {
          title: '9. International Order Returns',
          summaryNote: 'International customers are responsible for return customs duties and international freight charges.',
          content: (
            <>
              <p>
                For international shipments outside the primary destination country, customers are responsible for return shipping costs and any applicable customs duties or import taxes incurred during return transit.
              </p>
            </>
          ),
        },
        {
          title: '10. Contacting Returns & Support Team',
          summaryNote: 'Have questions about your return status? Contact our support team with your Order ID.',
          content: (
            <>
              <p>
                For assistance with an active return or refund inquiry, please reach out via our{' '}
                <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-bold underline">
                  Support Desk
                </Link>{' '}
                or email returns@nexcart.com.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
