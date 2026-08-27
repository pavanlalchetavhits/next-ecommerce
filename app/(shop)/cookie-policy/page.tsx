import PolicyPage, { PolicyHighlight } from '@/components/ui/PolicyPage';
import { Cookie, ShieldCheck, Lock, Eye } from 'lucide-react';
import Link from 'next/link';

export default function CookiePolicyPage() {
  const highlights: PolicyHighlight[] = [
    {
      icon: <Cookie className="w-5 h-5" />,
      title: 'Essential Session Cookies',
      description: 'Strictly necessary cookies to maintain user authentication, cart items, and checkout security.',
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Zero Ad-Tracker Sales',
      description: 'We do not sell your browsing profiles or tracking cookies to third-party ad brokers.',
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Performance Insights',
      description: 'Anonymous telemetry cookies to analyze page speeds, fix broken links, and optimize UX.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: 'Browser Opt-Out Control',
      description: 'Easily manage or block optional cookies at any time through your web browser preferences.',
    },
  ];

  return (
    <PolicyPage
      activePolicy="cookie"
      title="Cookie & Tracking Policy"
      description="This Cookie Policy explains how NexCart uses cookies, web beacons, and similar tracking technologies to recognize you when you visit our website and deliver a fast, secure shopping experience."
      lastUpdated="27 August 2026"
      version="v2.4"
      readTime="5 min read"
      highlights={highlights}
      sections={[
        {
          title: '1. What Are Cookies & Web Tracking Technologies?',
          summaryNote: 'Cookies are small text files stored on your computer or mobile device when you load websites.',
          content: (
            <>
              <p>
                Cookies are small data files placed on your computer, smartphone, or tablet when you visit a website. Cookies are widely used by online businesses to make websites function efficiently, remember preferences, and provide analytical reporting.
              </p>
              <p className="mt-2">
                Technologies such as local storage, session storage, and web beacons (pixel tags) operate similarly to store session states across pages.
              </p>
            </>
          ),
        },
        {
          title: '2. Why Does NexCart Use Cookies?',
          summaryNote: 'We use cookies to maintain your active login session, preserve shopping cart contents, and remember currency preferences.',
          content: (
            <>
              <p>NexCart uses first-party and third-party cookies for several essential reasons:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Keeping you signed in securely without requesting your password on every page click.</li>
                <li>Remembering items placed inside your cart or wishlist while you browse products.</li>
                <li>Detecting security threats, bot attacks, and preventing fraudulent payment attempts.</li>
                <li>Measuring site performance, page load times, and broken page errors.</li>
              </ul>
            </>
          ),
        },
        {
          title: '3. Categories of Cookies We Use',
          summaryNote: 'We classify cookies into Strictly Necessary, Performance & Analytics, and Preference cookies.',
          content: (
            <>
              <div className="space-y-3 mt-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    A. Strictly Necessary Cookies (Essential)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Required for core website operation, checkout navigation, CSRF token security, and authentication state. Cannot be disabled without breaking site functionality.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    B. Functionality & Preference Cookies
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Remember your selected currency, shipping location, dark/light theme choice, and recently viewed products.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    C. Performance & Analytics Cookies
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Gather aggregated, anonymous traffic telemetry to understand popular categories, search trends, and optimize user experience.
                  </p>
                </div>
              </div>
            </>
          ),
        },
        {
          title: '4. Third-Party Integration Cookies',
          summaryNote: 'Secure third-party providers like Cashfree and Cloudinary set essential cookies to handle payments and image CDN optimization.',
          content: (
            <>
              <p>
                Certain third-party service providers integrated into NexCart may set cookies on your device to perform specialized tasks:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Cashfree PG / Payment Gateways:</strong> Secure fraud prevention and 3D-Secure payment authentication.</li>
                <li><strong>Cloudinary CDN:</strong> Optimizing image loading speeds based on client device screen resolution.</li>
              </ul>
            </>
          ),
        },
        {
          title: '5. Managing & Disabling Cookies in Your Browser',
          summaryNote: 'You have full control to clear, block, or manage cookies through your web browser settings.',
          content: (
            <>
              <p>
                Most modern web browsers allow you to control cookie preferences through their settings menu. You can block or delete cookies by modifying your browser settings:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Third-party cookies.</li>
                <li><strong>Mozilla Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Cookies and Site Data.</li>
                <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Block all cookies.</li>
                <li><strong>Microsoft Edge:</strong> Settings &gt; Site permissions &gt; Cookies and site data.</li>
              </ul>
              <p className="mt-2 text-xs text-slate-500">
                Please note that blocking essential cookies may disable your ability to log in or complete orders on NexCart.
              </p>
            </>
          ),
        },
        {
          title: '6. Do Not Track (DNT) Signals',
          summaryNote: 'We respect Do Not Track browser header preferences for optional telemetry analytics.',
          content: (
            <>
              <p>
                Some web browsers offer a &quot;Do Not Track&quot; (DNT) header signal. NexCart respects DNT preferences by automatically suppressing optional non-essential analytics tracking whenever DNT is enabled in your browser.
              </p>
            </>
          ),
        },
        {
          title: '7. Updates to This Cookie Policy & Contact Information',
          summaryNote: 'We periodically update our cookie policy. Contact our privacy team with any questions.',
          content: (
            <>
              <p>
                We may update this Cookie Policy periodically to reflect technological or legal updates. For questions regarding our cookie practices, please reach out via our{' '}
                <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-bold underline">
                  Contact Page
                </Link>{' '}
                or email privacy@nexcart.com.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
