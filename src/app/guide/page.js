"use client";

import { FiBookOpen, FiCheckCircle, FiEdit3, FiShare2, FiSettings, FiCreditCard, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function PublicGuidePage() {
  return (
    <div className="min-h-screen bg-surface text-text">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-primary-500 font-bold hover:text-primary-600 transition-colors">
          <FiArrowLeft /> Back to Home
        </Link>
        <ThemeToggle />
      </header>

      <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text mb-4 font-[family-name:var(--font-playfair)]">How OurMenu Works</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">Take a peek inside! See how easy it is to set up and manage your digital menu.</p>
        </div>

        <div className="space-y-8">
          {/* Section 1: Dashboard Overview */}
          <section className="bg-surface-alt border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
                <FiBookOpen size={24} />
              </div>
              <h2 className="text-xl font-bold text-text">1. The Dashboard</h2>
            </div>
            <p className="text-text-muted mb-4">
              Once you create your free account, you'll be greeted by your powerful yet simple dashboard. Here, you have complete control over what your customers see when they scan your QR code or visit your link.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-text-muted">
              <li><strong>Menu Management:</strong> Add and organize your menu categories (e.g., Starters, Mains, Drinks).</li>
              <li><strong>Settings:</strong> Update your brand colors, login credentials, and enable WhatsApp ordering.</li>
            </ul>
          </section>

          {/* Section 2: Adding Categories and Items */}
          <section className="bg-surface-alt border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
                <FiEdit3 size={24} />
              </div>
              <h2 className="text-xl font-bold text-text">2. Building Your Menu</h2>
            </div>
            
            <h3 className="font-semibold text-text mb-2">Creating Categories</h3>
            <p className="text-text-muted mb-4">
              Setting up your menu structure takes seconds. Just click <strong>Add Category</strong>, type a name, and hit save. Your customers will see these sections neatly organized.
            </p>

            <h3 className="font-semibold text-text mb-2">Adding Food Items</h3>
            <p className="text-text-muted mb-4">
              Inside any category, you can add food items. Upload a mouth-watering image, enter a title, description, and price. 
              Sold out of a dish? No problem. Simply toggle it off in the dashboard, and an "Out of stock" badge will instantly appear on your public menu. No more crossing out items on printed menus!
            </p>
          </section>

          {/* Section 3: WhatsApp Ordering */}
          <section className="bg-surface-alt border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
                <FiSettings size={24} />
              </div>
              <h2 className="text-xl font-bold text-text">3. Accept WhatsApp Orders</h2>
            </div>
            <p className="text-text-muted mb-4">
              Want customers to order directly to your phone? We've got you covered.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-text-muted">
              <li>Navigate to the <strong>Settings</strong> page in your dashboard.</li>
              <li>Open the <strong>WhatsApp Ordering</strong> section.</li>
              <li>Toggle "Accept Orders" to ON.</li>
              <li>Enter your restaurant's WhatsApp number and click Save.</li>
              <li>Instantly, "Order" buttons will appear next to your food items, and your customers can send beautifully formatted orders straight to your WhatsApp!</li>
            </ul>
          </section>

          {/* Section 4: Sharing & QR Codes */}
          <section className="bg-surface-alt border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
                <FiShare2 size={24} />
              </div>
              <h2 className="text-xl font-bold text-text">4. Sharing Your Menu</h2>
            </div>
            <p className="text-text-muted mb-4">
              Ditch the expensive printed menus. Getting your menu to your customers is effortless:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-text-muted">
              <li><strong>Your Unique Link:</strong> Your menu lives at a beautiful, short link (e.g., <code>ourmenu.click/YourRestaurant</code>). Perfect for Instagram bios, Facebook pages, or sending to customers.</li>
              <li><strong>Custom QR Code:</strong> Access your automatically generated QR code in the dashboard. Download it, print it, and place it on tables. Customers just scan it with their phone cameras to see your menu!</li>
            </ul>
          </section>

          {/* Section 5: Subscriptions & Billing */}
          <section className="bg-surface-alt border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
                <FiCreditCard size={24} />
              </div>
              <h2 className="text-xl font-bold text-text">5. Simple Billing</h2>
            </div>
            <p className="text-text-muted mb-4">
              We make billing completely transparent and hassle-free.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-text-muted">
              <li>Create your menu for <strong>free</strong>. You only pay a tiny, highly affordable fee (less than the cost of a good cup of coffee!) when you're ready to share it with the public.</li>
              <li>When you're ready, visit the <strong>Billing</strong> section inside your Settings to activate your subscription directly via M-Pesa.</li>
              <li>Track your active subscription status and expiry dates right from your dashboard.</li>
            </ul>
          </section>

          {/* Closing */}
          <div className="mt-8 p-6 bg-primary-500/10 border border-primary-500/20 rounded-xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <FiCheckCircle className="text-primary-500 shrink-0" size={40} />
            <div>
              <h3 className="font-bold text-text text-xl mb-1">Ready to upgrade your restaurant?</h3>
              <p className="text-text-muted">It takes less than 5 minutes to set up your digital menu.</p>
            </div>
            <div className="sm:ml-auto mt-4 sm:mt-0">
              <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-6 py-3 font-bold text-white hover:bg-primary-600 transition-colors active:scale-95 whitespace-nowrap">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
