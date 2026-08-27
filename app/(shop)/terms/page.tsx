import PolicyPage, { PolicyHighlight } from '@/components/ui/PolicyPage';
import { Scale, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  const highlights: PolicyHighlight[] = [
    {
      icon: <Scale className="w-5 h-5" />,
      title: 'Fair & Transparent',
      description: 'Clear, binding terms built to protect both buyer rights and platform integrity.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: 'Encrypted Payments',
      description: 'All online transactions processed through 256-bit SSL PCI-DSS compliant gateways.',
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: 'Tracked Delivery',
      description: 'Transparent order fulfillment with real-time tracking from dispatch to doorstep.',
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: '30-Day Guarantee',
      description: 'Hassle-free return policy for eligible products within 30 days of receiving your item.',
    },
  ];

  return (
    <PolicyPage
      activePolicy="terms"
      title="Terms & Conditions"
      description="Please read these terms carefully before using NexCart. By placing an order or using our services, you agree to be bound by these legal terms and store policies."
      lastUpdated="27 August 2026"
      version="v2.4"
      readTime="8 min read"
      highlights={highlights}
      sections={[
        {
          title: '1. Acceptance of Terms & Service Eligibility',
          summaryNote: 'Using NexCart signifies your agreement to these binding terms. You must be at least 18 years of age (or legal age in your jurisdiction) to place orders.',
          content: (
            <>
              <p>
                By accessing, browsing, or making purchases on <strong>NexCart Store</strong> (referred to as &quot;NexCart&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
              </p>
              <p className="mt-2">
                If you do not agree with any part of these terms, you must discontinue using our website and services immediately. Accessing our platform from regions where its content is illegal is strictly prohibited.
              </p>
            </>
          ),
        },
        {
          title: '2. User Account Registration & Account Security',
          summaryNote: 'You are responsible for maintaining the confidentiality of your account credentials and all activity performed under your account.',
          content: (
            <>
              <p>
                To access certain features, place orders, or save preferences, you may be required to register an account. When creating your account, you agree to:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Provide accurate, truthful, and complete personal details.</li>
                <li>Keep your email address and password strictly confidential.</li>
                <li>Notify us immediately of any unauthorized access or breach of security.</li>
                <li>Ensure you log out at the end of each session when using shared computers.</li>
              </ul>
              <p className="mt-2">
                NexCart reserves the right to suspend or terminate accounts that provide fraudulent information or violate security rules.
              </p>
            </>
          ),
        },
        {
          title: '3. Products, Pricing & Availability Accuracy',
          summaryNote: 'We aim for complete pricing and product accuracy, but reserve the right to correct accidental errors or update pricing without notice.',
          content: (
            <>
              <p>
                We strive to present product descriptions, high-resolution images, specifications, and prices as accurately as possible. However:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Colors displayed on screens may vary depending on monitor calibrations.</li>
                <li>Prices, stock availability, and promotional offers are subject to change without prior notice.</li>
                <li>In the event of a pricing or typographical error, we reserve the right to cancel affected orders prior to shipping.</li>
              </ul>
            </>
          ),
        },
        {
          title: '4. Order Placement, Acceptance & Right to Cancel',
          summaryNote: 'Placing an order is an offer to buy. Order confirmation emails signify receipt of your order, subject to final verification and dispatch.',
          content: (
            <>
              <p>
                When you place an order on NexCart, you receive an automated Order Confirmation email. This email acknowledges receipt of your order but does not represent legal acceptance of your purchase offer.
              </p>
              <p className="mt-2">
                We reserve the right to refuse or cancel any order for reasons including: item unavailablity, suspected fraud, billing address verification failure, or quantity restrictions per customer.
              </p>
            </>
          ),
        },
        {
          title: '5. Payment Terms & Gateway Authorization',
          summaryNote: 'Online payments are processed securely via Cashfree & credit card providers. Cash on Delivery (COD) orders require physical cash upon delivery.',
          content: (
            <>
              <p>
                We accept major payment methods including Credit/Debit Cards, Net Banking, UPI, and authorized Cashfree PG transactions.
              </p>
              <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Cash on Delivery (COD) Rules:
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  COD orders require full payment in cash or local valid currency upon arrival of the delivery courier. Failure to accept or pay for COD orders without valid justification may result in account restriction.
                </p>
              </div>
            </>
          ),
        },
        {
          title: '6. Shipping, Freight & Risk of Loss',
          summaryNote: 'Products are shipped to the address provided at checkout. Risk of loss passes to the buyer upon courier delivery.',
          content: (
            <>
              <p>
                Estimated delivery timelines are provided at checkout for informational purposes and are not guaranteed. NexCart is not liable for shipping delays caused by customs, severe weather, courier delays, or incorrect shipping addresses entered by the customer.
              </p>
            </>
          ),
        },
        {
          title: '7. Returns, Replacements & Refund Policy',
          summaryNote: 'Eligible unused items in original packaging can be returned within 30 days of delivery.',
          content: (
            <>
              <p>
                We want you to be delighted with your purchase. Eligible products can be returned within 30 calendar days from delivery date provided they are unused, in original condition, and accompanied by original packaging and invoice.
              </p>
              <p className="mt-2">
                Refunds are processed back to the original payment method after quality inspection at our warehouse (typically 5 to 7 business days).
              </p>
            </>
          ),
        },
        {
          title: '8. Intellectual Property & Trademark Protection',
          summaryNote: 'All website code, content, logos, graphics, and design assets are protected intellectual property of NexCart Inc.',
          content: (
            <>
              <p>
                All trademarks, domain names, UI designs, code, text, graphics, logos, icons, and software on NexCart belong exclusively to NexCart Store Inc. or its content suppliers. Unpermitted copying, reprinting, scraping, or redistribution is strictly prohibited.
              </p>
            </>
          ),
        },
        {
          title: '9. Prohibited Platform Activities & Abuse',
          summaryNote: 'Misuse of our platform, hacking attempts, or automated data extraction will result in immediate ban and legal action.',
          content: (
            <>
              <p>When using NexCart, you agree NOT to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Attempt to breach security measures or access non-public server databases.</li>
                <li>Use web scrapers, bots, or automated extractors without explicit written consent.</li>
                <li>Submit false or fraudulent orders or engage in payment chargeback fraud.</li>
                <li>Distribute viruses, malware, or harmful scripts across the domain.</li>
              </ul>
            </>
          ),
        },
        {
          title: '10. Limitation of Liability & Warranty Disclaimer',
          summaryNote: 'NexCart provides services on an "as-is" basis. Our maximum legal liability is limited to the purchase price of your order.',
          content: (
            <>
              <p>
                To the fullest extent permitted by applicable law, NexCart shall not be liable for indirect, incidental, punitive, or consequential damages resulting from your use of the website or purchased products.
              </p>
            </>
          ),
        },
        {
          title: '11. Governing Law & Dispute Resolution',
          summaryNote: 'These terms are governed by federal and state e-commerce laws. Disputes will be resolved through good-faith negotiation or arbitration.',
          content: (
            <>
              <p>
                These Terms & Conditions are governed and construed in accordance with applicable state and federal laws without regard to conflict of law principles. Any dispute arising out of or relating to these terms shall first be addressed through informal negotiation with customer support.
              </p>
            </>
          ),
        },
        {
          title: '12. Modifications to Terms & Contact Support',
          summaryNote: 'We may update these terms periodically. Continued use after revisions constitutes acceptance of new terms.',
          content: (
            <>
              <p>
                NexCart reserves the right to amend or update these Terms & Conditions at any time. We will indicate the revised date at the top of this document. For inquiries regarding our terms, please reach out via our{' '}
                <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-bold underline">
                  Contact Us page
                </Link>{' '}
                or email support@nexcart.com.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
