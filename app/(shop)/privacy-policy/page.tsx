import PolicyPage, { PolicyHighlight } from '@/components/ui/PolicyPage';
import { ShieldCheck, Lock, Eye, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const highlights: PolicyHighlight[] = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Zero Data Selling',
      description: 'We never sell or rent your personal information to third-party advertisers.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: '256-Bit Encryption',
      description: 'Industry-standard SSL encryption safeguards all data transmissions and credentials.',
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Full Transparency',
      description: 'Clear details on what information we collect, why we collect it, and how it is used.',
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: 'You control your Data',
      description: 'Request access, correction, export, or complete deletion of your personal account data at any time.',
    },
  ];

  return (
    <PolicyPage
      activePolicy="privacy"
      title="Privacy Policy"
      description="At NexCart, your privacy and data security are paramount. This policy outlines how we collect, handle, safeguard, and respect your personal information across our platform."
      lastUpdated="27 August 2026"
      version="v2.4"
      readTime="7 min read"
      highlights={highlights}
      sections={[
        {
          title: '1. Information We Collect',
          summaryNote: 'We collect personal information you provide directly, transactional details, and automatic usage telemetry to deliver our e-commerce services.',
          content: (
            <>
              <p>
                When you interact with NexCart, we collect information necessary to fulfill orders, maintain your user account, and improve platform performance:
              </p>
              <div className="space-y-3 mt-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    A. Information You Provide Voluntarily
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Name, email address, contact phone number, shipping address, billing address, account password, and customer support communications.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    B. Order & Payment Data
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Order items, total amount paid, payment method selected (Card, UPI, COD), transaction reference IDs, and invoice details.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    C. Technical & Device Information
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    IP address, browser type, operating system, device identifiers, referring URLs, and website navigation patterns.
                  </p>
                </div>
              </div>
            </>
          ),
        },
        {
          title: '2. How We Use Your Personal Information',
          summaryNote: 'We use your data solely for legitimate business operations including order delivery, fraud prevention, support, and service enhancements.',
          content: (
            <>
              <p>Your information is processed for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Processing, packing, shipping, and delivering your ordered goods.</li>
                <li>Verifying payments, issuing invoices, and processing eligible refunds.</li>
                <li>Providing order updates, tracking alerts, and responsive customer service.</li>
                <li>Preventing fraudulent transactions and ensuring platform cyber-security.</li>
                <li>Sending promotional updates and VIP discount alerts (if opted in).</li>
              </ul>
            </>
          ),
        },
        {
          title: '3. Payment Information & Third-Party Payment Gateways',
          summaryNote: 'Credit card details and payment credentials are processed directly by certified payment processors like Cashfree.',
          content: (
            <>
              <p>
                NexCart does NOT store sensitive payment credentials (such as full credit card numbers, CVVs, or bank PINs) on our servers.
              </p>
              <p className="mt-2">
                All online payments are securely tokenized and processed through PCI-DSS compliant payment gateways (such as Cashfree PG). We receive only authorization status and transaction tokens to confirm order payments.
              </p>
            </>
          ),
        },
        {
          title: '4. Cookies & Similar Tracking Technologies',
          summaryNote: 'We use session and analytical cookies to remember your login state, shopping cart contents, and store preferences.',
          content: (
            <>
              <p>
                Cookies are small data files stored on your device. NexCart uses essential cookies to keep you signed in, remember items in your shopping bag, and preserve user preferences.
              </p>
              <p className="mt-2">
                You can manage cookie settings in your browser at any time. Disabling essential cookies may impair core functionality like cart checkout and account login.
              </p>
            </>
          ),
        },
        {
          title: '5. Sharing of Information with Authorized Service Partners',
          summaryNote: 'We share necessary order data only with verified partners required to operate our service (couriers, email, cloud hosting).',
          content: (
            <>
              <p>We do not sell or monetize your personal data. We share limited necessary data with trusted service providers:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Delivery & Logistics Partners:</strong> Shipping address and phone number for courier delivery.</li>
                <li><strong>Cloud Infrastructure & Database Hosting:</strong> Encrypted storage of account records.</li>
                <li><strong>Email & SMS Gateways:</strong> Dispatching transactional order confirmations and shipping updates.</li>
                <li><strong>Legal Authorities:</strong> Only when strictly required by valid subpoena, law enforcement request, or legal obligation.</li>
              </ul>
            </>
          ),
        },
        {
          title: '6. Data Security, Storage & Safeguards',
          summaryNote: 'We employ multi-layered technical standards including 256-bit SSL encryption, firewalls, and strict access controls.',
          content: (
            <>
              <p>
                We implement industry-leading technical and organizational security measures to protect your data against unauthorized access, loss, misuse, or alteration.
              </p>
              <p className="mt-2">
                While we enforce strict safeguards, no internet transmission is 100% immune. We encourage users to maintain strong passwords and safeguard their account credentials.
              </p>
            </>
          ),
        },
        {
          title: '7. Data Retention & Account Deletion',
          summaryNote: 'We retain account data as long as your account remains active or as required by law for accounting and tax records.',
          content: (
            <>
              <p>
                We retain personal information for the period necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is mandated by law (e.g., tax, audit, and legal reporting requirements).
              </p>
            </>
          ),
        },
        {
          title: '8. Your Rights & Data Choices',
          summaryNote: 'You have full rights to access, review, update, or request permanent deletion of your personal data.',
          content: (
            <>
              <p>Depending on your region, you possess rights concerning your personal information:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Right to Rectification:</strong> Update or correct inaccurate account details.</li>
                <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request deletion of your account and personal records.</li>
                <li><strong>Opt-Out Rights:</strong> Unsubscribe from marketing communications at any time.</li>
              </ul>
            </>
          ),
        },
        {
          title: "9. Children's Privacy Notice",
          summaryNote: 'NexCart does not knowingly solicit or collect data from children under the age of 16.',
          content: (
            <>
              <p>
                Our store is intended for adult shoppers. We do not knowingly collect personal information from individuals under 16 years of age. If we become aware that a child under 16 has submitted personal data, we will take immediate steps to remove it.
              </p>
            </>
          ),
        },
        {
          title: '10. Privacy Policy Updates & Contact Details',
          summaryNote: 'We periodically update this policy to reflect operational changes. Contact our privacy officer with any questions.',
          content: (
            <>
              <p>
                NexCart may update this Privacy Policy from time to time to reflect changes in our legal obligations or store operations. Any modifications will be posted on this page with an updated revision date.
              </p>
              <p className="mt-2">
                For questions, concerns, or data subject requests, please contact our Privacy Team via our{' '}
                <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-bold underline">
                  Contact Support Page
                </Link>{' '}
                or directly by email at privacy@nexcart.com.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
