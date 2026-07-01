import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";

export const metadata = {
  title: "Privacy Policy — Kenyan.menu",
  description: "Learn how Kenyan.menu collects, uses, and protects your personal data in accordance with the Kenya Data Protection Act 2019.",
};

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-surface text-text">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image src="/logo.png" alt="Kenyan.menu logo" width={32} height={32} className="rounded-lg" />
          <span className="font-logo text-2xl sm:text-3xl tracking-tight text-primary-500">
            Kenyan.menu
          </span>
        </Link>
        <Link href="/signup" className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-primary-500 transition-colors">
          <FiArrowLeft className="h-4 w-4" /> Back
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-text mb-3">Privacy Policy</h1>
          <p className="text-sm text-text-muted">Last updated: {lastUpdated}</p>
          <p className="mt-4 text-sm text-primary-500 font-semibold">
            Compliant with the Kenya Data Protection Act No. 24 of 2019
          </p>
        </div>

        <div className="space-y-10 text-text-muted leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-text mb-3">1. Who We Are (Data Controller)</h2>
            <p>
              Kenyan.menu is the data controller for personal information collected through this platform. We are responsible for how your personal data is collected, stored, used, and protected, in accordance with the Kenya Data Protection Act No. 24 of 2019.
            </p>
            <div className="mt-3 rounded-xl border border-border bg-surface-alt p-5 space-y-1 text-sm">
              <p><strong className="text-text">Contact:</strong> kenyamenu8@gmail.com</p>
              <p><strong className="text-text">Phone:</strong> +254 704 286 209</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">2. What Data We Collect</h2>
            <p className="mb-3">We collect the following categories of personal data:</p>

            <h3 className="font-semibold text-text mb-2">From Business Owners (Registered Users)</h3>
            <ul className="list-disc list-inside space-y-2 ml-2 mb-5">
              <li><strong className="text-text">Restaurant Name</strong> — used as your unique identifier and public menu URL slug</li>
              <li><strong className="text-text">Location</strong> — the city or area your business operates in</li>
              <li><strong className="text-text">Password</strong> — stored as a securely hashed value; we never store plain-text passwords</li>
              <li><strong className="text-text">Brand colour preference</strong> — used to theme your public menu page</li>
              <li><strong className="text-text">Menu content</strong> — food categories, item names, prices, descriptions, and images you upload</li>
              <li><strong className="text-text">Payment reference messages</strong> — M-PESA transaction codes you submit for subscription verification</li>
            </ul>

            <h3 className="font-semibold text-text mb-2">From Menu Viewers (Public Customers)</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>We do not require registration or collect personal data from members of the public who view menus</li>
              <li>Standard server logs (IP address, browser type, pages accessed) may be recorded automatically by our hosting infrastructure for security and performance monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">3. Legal Basis for Processing</h2>
            <p className="mb-3">Under the Kenya Data Protection Act 2019, we process your data on the following lawful bases:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-text">Performance of a contract</strong> — to provide you with the digital menu service you signed up for</li>
              <li><strong className="text-text">Consent</strong> — when you voluntarily provide information during registration and agree to these terms</li>
              <li><strong className="text-text">Legitimate interests</strong> — to maintain platform security, prevent fraud, and improve the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">4. How We Use Your Data</h2>
            <p className="mb-3">Your data is used solely to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Create and manage your account and public menu</li>
              <li>Verify your subscription payment and activate your menu</li>
              <li>Generate your unique QR code and shareable menu link</li>
              <li>Communicate with you regarding your account or subscription</li>
              <li>Maintain the security and integrity of the platform</li>
            </ul>
            <p className="mt-3">
              <strong className="text-text">We do not sell, rent, or share your personal data with third parties for marketing purposes.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">5. Data Storage and Security</h2>
            <p>
              Your data is stored on secured servers. Passwords are hashed and never stored in plain text. We implement reasonable technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">6. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide the Service. If you close your account, we will delete or anonymise your personal data within a reasonable period, unless retention is required by law or for legitimate business purposes such as resolving disputes or fraud prevention.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">7. Your Rights (Data Subject Rights)</h2>
            <p className="mb-3">
              Under the Kenya Data Protection Act 2019 (Sections 26–34), you have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-text">Right of Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong className="text-text">Right to Rectification</strong> — request correction of inaccurate or incomplete data</li>
              <li><strong className="text-text">Right to Erasure</strong> — request deletion of your data where there is no lawful basis for continued processing</li>
              <li><strong className="text-text">Right to Object</strong> — object to processing of your data in certain circumstances</li>
              <li><strong className="text-text">Right to Data Portability</strong> — receive your data in a structured, commonly used format</li>
              <li><strong className="text-text">Right to Withdraw Consent</strong> — where processing is based on consent, you may withdraw it at any time</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at <a href="mailto:kenyamenu8@gmail.com" className="text-primary-500 hover:underline">kenyamenu8@gmail.com</a>. We will respond within 21 days as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">8. Cookies and Local Storage</h2>
            <p>
              We use browser <strong className="text-text">localStorage</strong> (not cookies) to store your authentication session and theme preference locally on your device. No personal data stored in localStorage is transmitted to third parties. You can clear this data at any time by clearing your browser storage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">9. Third-Party Services</h2>
            <p>
              Our payment verification is conducted manually via M-PESA. We do not directly integrate with or transmit your M-PESA data to Safaricom. You submit a transaction code to us as confirmation. Images uploaded to the platform may be stored via our backend hosting service. We use only reputable infrastructure providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">10. Children&apos;s Privacy</h2>
            <p>
              The Service is intended for business owners who are at least 18 years of age. We do not knowingly collect personal data from individuals under 18. If you believe a minor has submitted personal data to us, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">11. Complaints</h2>
            <p>
              If you believe we have not handled your personal data in accordance with the Kenya Data Protection Act 2019, you have the right to lodge a complaint with the <strong className="text-text">Office of the Data Protection Commissioner of Kenya (ODPC)</strong> at <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">www.odpc.go.ke</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes via your registered contact details. The date at the top of this page indicates when the policy was last revised.
            </p>
          </section>

        </div>

        <div className="mt-16 border-t border-border pt-8 text-center text-sm text-text-muted">
          <Link href="/terms" className="text-primary-500 hover:underline">Terms and Conditions</Link>
          <span className="mx-3">·</span>
          <Link href="/signup" className="text-primary-500 hover:underline">Back to Sign Up</Link>
        </div>
      </main>
    </div>
  );
}
