"use client";

import { FiBookOpen, FiCheckCircle, FiEdit3, FiShare2, FiSettings, FiCreditCard } from "react-icons/fi";

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">How to Operate Your Menu</h1>
        <p className="text-text-muted">A comprehensive guide on managing your digital menu.</p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Dashboard Overview */}
        <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
              <FiBookOpen size={24} />
            </div>
            <h2 className="text-xl font-bold text-text">1. Getting Started</h2>
          </div>
          <p className="text-text-muted mb-4">
            Welcome to your dashboard! Here, you can completely control what your customers see when they scan your QR code or visit your link. 
            The dashboard is divided into several main areas accessible from the sidebar (or bottom bar on mobile):
          </p>
          <ul className="list-disc pl-5 space-y-2 text-text-muted">
            <li><strong>Home (Categories):</strong> Add and manage your menu sections (e.g., Starters, Mains, Drinks).</li>
            <li><strong>Settings:</strong> Update your brand colors, restaurant details, and password.</li>
            <li><strong>Payments (Billing):</strong> Check your subscription status and plan limits.</li>
          </ul>
        </section>

        {/* Section 2: Adding Categories and Items */}
        <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
              <FiEdit3 size={24} />
            </div>
            <h2 className="text-xl font-bold text-text">2. Building Your Menu</h2>
          </div>
          
          <h3 className="font-semibold text-text mb-2">Adding Categories</h3>
          <p className="text-text-muted mb-4">
            Before adding food, you need categories. Go to <strong>Home</strong> and click the <strong>Add Category</strong> button. 
            Give your category a name and an optional description. Once created, click on the category card to open it.
          </p>

          <h3 className="font-semibold text-text mb-2">Adding Food Items</h3>
          <p className="text-text-muted mb-4">
            Inside a category, click <strong>Add Item</strong>. You can upload an image, enter the name, description, and price. 
            You can also toggle whether an item is <strong>Available</strong> or not. Unavailable items will display an "Out of stock" badge to your customers.
          </p>
        </section>

        {/* Section 3: Sharing */}
        <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
              <FiShare2 size={24} />
            </div>
            <h2 className="text-xl font-bold text-text">3. Sharing Your Menu</h2>
          </div>
          <p className="text-text-muted mb-4">
            You don't need to print physical menus anymore! 
          </p>
          <ul className="list-disc pl-5 space-y-2 text-text-muted">
            <li><strong>Share Button:</strong> Look for the "Share" button at the top of your dashboard.</li>
            <li><strong>Public Link:</strong> Copy your unique link and share it on your social media (Instagram bio, Facebook page) or via WhatsApp.</li>
            <li><strong>QR Code:</strong> Click <strong>Download QR Code</strong> to save a high-quality image. You can print this and place it on your tables for customers to scan.</li>
          </ul>
        </section>

        {/* Section 4: Settings */}
        <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
              <FiSettings size={24} />
            </div>
            <h2 className="text-xl font-bold text-text">4. Customization & Settings</h2>
          </div>
          <p className="text-text-muted mb-4">
            Make the menu match your brand's identity:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-text-muted">
            <li>Navigate to the <strong>Settings</strong> page.</li>
            <li>Use the color picker to select your brand's primary color. Your public menu will instantly update to use this color for buttons, headers, and accents.</li>
            <li>You can also reset your password from the settings page if needed.</li>
          </ul>
        </section>

        {/* Section 5: Billing */}
        <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
              <FiCreditCard size={24} />
            </div>
            <h2 className="text-xl font-bold text-text">5. Managing Your Subscription</h2>
          </div>
          <p className="text-text-muted mb-4">
            If your public menu is hidden, it means your subscription might have expired or you haven't activated it yet.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-text-muted">
            <li>Go to the <strong>Payments / Billing</strong> tab.</li>
            <li>You can see your current plan, how many items you've used, and instructions on how to pay via M-Pesa.</li>
            <li>Follow the instructions provided to activate or renew your plan.</li>
          </ul>
        </section>

        {/* Closing */}
        <div className="mt-8 p-6 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center gap-4">
          <FiCheckCircle className="text-primary-500 shrink-0" size={32} />
          <div>
            <h3 className="font-bold text-text text-lg">You're all set!</h3>
            <p className="text-text-muted text-sm">If you need any extra help, feel free to reach out to our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
