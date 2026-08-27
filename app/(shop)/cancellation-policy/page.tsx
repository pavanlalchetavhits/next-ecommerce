import PolicyPage, { PolicyHighlight } from '@/components/ui/PolicyPage';
import { Ban, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CancellationPolicyPage() {
  const highlights: PolicyHighlight[] = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Instant Pre-Shipment Cancel',
      description: 'Cancel orders instantly before item dispatch directly from your account order dashboard.',
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: '100% Full Refund',
      description: 'Pre-paid cancelled orders receive full 100% refund without any hidden processing fees.',
    },
    {
      icon: <Ban className="w-5 h-5" />,
      title: 'Zero Cancellation Fees',
      description: 'No penalty fees for orders cancelled within the allowed pre-fulfillment window.',
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      title: 'COD Doorstep Rejection',
      description: 'Refuse delivery at doorstep if you wish to cancel after parcel has already shipped.',
    },
  ];

  return (
    <PolicyPage
      activePolicy="cancellation"
      title="Order Cancellation Policy"
      description="Need to change your mind or modify your order? Our Cancellation Policy explains when and how you can cancel your NexCart purchases easily and get refunded."
      lastUpdated="27 August 2026"
      version="v2.4"
      readTime="5 min read"
      highlights={highlights}
      sections={[
        {
          title: '1. Cancellation Window & Order Statuses',
          summaryNote: 'Orders can be cancelled free of charge at any point prior to warehouse fulfillment and shipment dispatch.',
          content: (
            <>
              <p>
                We process orders rapidly to ensure fast delivery. You can cancel your order free of penalty as long as your order status remains in <strong>&quot;Pending&quot;</strong> or <strong>&quot;Processing&quot;</strong> stage prior to courier handover.
              </p>
              <p className="mt-2">
                Once an order transitions to <strong>&quot;Shipped&quot;</strong> or <strong>&quot;Out for Delivery&quot;</strong>, direct online cancellation is locked because the parcel is in courier transit.
              </p>
            </>
          ),
        },
        {
          title: '2. How to Cancel Your Order (Self-Service)',
          summaryNote: 'Cancel your order in seconds directly through your NexCart user account dashboard.',
          content: (
            <>
              <p>To cancel an order before dispatch:</p>
              <ol className="list-decimal pl-5 space-y-1.5 mt-2">
                <li>Go to your <Link href="/profile" className="text-indigo-600 dark:text-indigo-400 font-bold underline">My Orders</Link> dashboard.</li>
                <li>Locate the pending order you wish to cancel.</li>
                <li>Click the <strong>&quot;Cancel Order&quot;</strong> button and choose your cancellation reason.</li>
                <li>Receive immediate email and SMS confirmation of successful cancellation.</li>
              </ol>
            </>
          ),
        },
        {
          title: '3. Pre-Dispatch vs Post-Dispatch Cancellations',
          summaryNote: 'Pre-dispatch cancellations receive immediate refunds. Post-dispatch parcels can be refused upon delivery.',
          content: (
            <>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200">
                  <span className="font-bold">A. Pre-Dispatch Cancellations: </span>
                  Order is stopped immediately in warehouse, stock is released, and 100% refund is issued right away.
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold">B. Post-Dispatch (In Transit): </span>
                  If your package has already shipped, simply refuse to accept delivery when the courier arrives. Once the parcel is returned to our warehouse, your refund will be processed minus applicable freight charges.
                </div>
              </div>
            </>
          ),
        },
        {
          title: '4. Refund Timeline for Cancelled Prepaid Orders',
          summaryNote: 'Full refunds for pre-paid cancelled orders are credited back to your original payment method within 24 hours to 5 business days.',
          content: (
            <>
              <p>When you cancel a prepaid order, funds are returned directly to the payment instrument used:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>UPI Payments (GPay, PhonePe, Paytm):</strong> 24 to 48 hours.</li>
                <li><strong>Credit / Debit Cards:</strong> 3 to 5 business days.</li>
                <li><strong>Net Banking & Cashfree PG:</strong> 2 to 4 business days.</li>
              </ul>
            </>
          ),
        },
        {
          title: '5. Cash on Delivery (COD) Order Cancellation Rules',
          summaryNote: 'COD orders can be cancelled online without payment deduction prior to delivery.',
          content: (
            <>
              <p>
                Since COD orders do not involve advance payment, cancelling a COD order before dispatch incurs no financial charge.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Note: Repeatedly cancelling COD orders at doorstep without valid reason may result in temporary suspension of the Cash on Delivery payment option on your user account.
              </p>
            </>
          ),
        },
        {
          title: '6. Cancellations Initiated by NexCart',
          summaryNote: 'NexCart reserves the right to cancel orders due to stockouts, pricing glitches, or address inaccuracies with 100% full refund.',
          content: (
            <>
              <p>Occasionally, NexCart may be forced to cancel an order due to unforeseen circumstances, including:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Unintended inventory stockout or damaged warehouse batch.</li>
                <li>Inability to verify shipping address or phone number.</li>
                <li>Detection of fraudulent transaction flags by our automated security systems.</li>
              </ul>
              <p className="mt-2">In such cases, you will be notified immediately and issued a 100% complete refund.</p>
            </>
          ),
        },
        {
          title: '7. Order Modifications (Address, Size & Item Changes)',
          summaryNote: 'Shipping addresses or item sizes can be updated before dispatch by contacting customer support.',
          content: (
            <>
              <p>
                If you made a typo in your shipping address or ordered the wrong size, you do not necessarily need to cancel your entire order. Contact support immediately at support@nexcart.com to request an in-flight address or variant correction before dispatch.
              </p>
            </>
          ),
        },
        {
          title: '8. Special Promotion & Flash Sale Cancellation Terms',
          summaryNote: 'Orders bought with limited promotional coupons will refund the net amount paid.',
          content: (
            <>
              <p>
                If an order was purchased using a promotional discount coupon, your refund will equal the exact net amount paid after discount application. The promo code may or may not reactivate depending on coupon validity terms.
              </p>
            </>
          ),
        },
        {
          title: '9. Contacting Order Cancellation Support',
          summaryNote: 'Need urgent cancellation help? Reach our support desk immediately.',
          content: (
            <>
              <p>
                For urgent order cancellation inquiries, please reach out via our{' '}
                <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-bold underline">
                  Support Center
                </Link>{' '}
                or call +1 (800) 555-NEXC.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
