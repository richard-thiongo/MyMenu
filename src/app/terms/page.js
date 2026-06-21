import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";

export const metadata = {
  title: "Terms and Conditions — Kenyan.menu",
  description: "Read the Terms and Conditions for using the Kenyan.menu platform.",
};

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-surface text-text">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image src="/logo.png" alt="Kenyan.menu logo" width={32} height={32} className="rounded-lg" />
          <span className="rounded-lg border border-primary-500/20 bg-primary-500/10 px-3 py-1 text-lg font-bold tracking-tight text-primary-500">
            Kenyan.menu
          </span>
        </Link>
        <Link href="/signup" className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-primary-500 transition-colors">
          <FiArrowLeft className="h-4 w-4" /> Back
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-text mb-3">Terms and Conditions</h1>
          <p className="text-sm text-text-muted">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-10 text-text-muted leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-text mb-3">1. Acceptance of Terms</h2>
            <p>
              By registering for or using the Kenyan.menu platform (&ldquo;the Service&rdquo;), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, do not use the Service. These terms apply to all users, including restaurant owners and their customers who view public menus.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">2. The Service</h2>
            <p className="mb-3">
              Kenyan.menu is a digital menu platform that allows hospitality businesses (restaurants, hotels, cafes, bars, food trucks, and similar establishments) registered in Kenya to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Create and manage digital food and beverage menus</li>
              <li>Generate branded QR codes and shareable links to their menus</li>
              <li>Allow customers to browse menus via a public URL without downloading an app</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">3. Account Registration</h2>
            <p className="mb-3">
              To use the Service as a business owner, you must register an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your password and account credentials</li>
              <li>Notify us immediately of any unauthorised use of your account</li>
              <li>Be responsible for all activity occurring under your account</li>
            </ul>
            <p className="mt-3">
              You must be at least 18 years of age to create an account and operate a business on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">4. Subscription and Payments</h2>
            <p className="mb-3">
              Access to the platform requires a monthly subscription fee payable via M-PESA:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-text">Basic Plan:</strong> KES 1,500/month — for menus with up to 90 food items</li>
              <li><strong className="text-text">Advanced Plan:</strong> KES 2,000/month — for menus with more than 90 food items</li>
            </ul>
            <p className="mt-3">
              Subscriptions are activated manually by our team upon payment verification. Your public menu will remain hidden until your subscription is active. We reserve the right to adjust pricing with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">5. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Post false, misleading, or fraudulent menu information</li>
              <li>Upload content that is offensive, illegal, or infringes third-party rights</li>
              <li>Attempt to hack, reverse-engineer, or disrupt the Service</li>
              <li>Use the platform for any purpose other than legitimate business menu management</li>
              <li>Impersonate another business or individual</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">6. Content Ownership</h2>
            <p>
              You retain ownership of all content you upload to the platform (menu items, images, descriptions). By uploading content, you grant Kenyan.menu a non-exclusive, royalty-free licence to store, display, and serve that content as necessary to operate the Service. You represent and warrant that you have the right to use and upload all content you submit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">7. Suspension and Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our discretion if you violate these Terms, fail to pay your subscription, or engage in conduct that harms other users or the platform. You may terminate your account at any time by contacting us. Upon termination, your data will be handled as described in our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by Kenyan law, Kenyan.menu shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including loss of revenue, data, or business opportunity. The platform is provided &ldquo;as is&rdquo; without warranties of uninterrupted or error-free operation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">9. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of Kenya, including the Kenya Information and Communications Act (Cap. 411A) and the Data Protection Act No. 24 of 2019. Any disputes shall be subject to the exclusive jurisdiction of the courts of Kenya.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">10. Changes to These Terms</h2>
            <p>
              We may update these Terms at any time. We will notify registered users of significant changes via their registered contact information. Continued use of the Service after changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text mb-3">11. Contact</h2>
            <p>
              For questions regarding these Terms, contact us at:
            </p>
            <div className="mt-3 rounded-xl border border-border bg-surface-alt p-5 space-y-1">
              <p><strong className="text-text">Email:</strong> richardthiongo0@gmail.com</p>
              <p><strong className="text-text">Phone:</strong> +254 704 286 209</p>
            </div>
          </section>

        </div>

        <div className="mt-16 border-t border-border pt-8 text-center text-sm text-text-muted">
          <Link href="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>
          <span className="mx-3">·</span>
          <Link href="/signup" className="text-primary-500 hover:underline">Back to Sign Up</Link>
        </div>
      </main>
    </div>
  );
}
