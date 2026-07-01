# MyMenu — Frontend

MyMenu is a full-stack digital menu platform for Kenyan restaurants, hotels, cafes, and bars. Restaurant owners register their business, build their menu, and share it publicly via a branded link or QR code. Customers scan a QR code or visit the link to browse the menu in a clean, mobile-friendly interface — no app download required.

This repository contains the **frontend** built with **Next.js (App Router)** and styled exclusively with **Tailwind CSS**.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
  - [src/app](#srcapp)
  - [src/components](#srccomponents)
  - [src/hooks](#srchooks)
  - [src/lib](#srclib)
  - [src/providers](#srcproviders)
- [Legal & Compliance](#legal--compliance)
- [SEO & AI Optimization](#seo--ai-optimization)

---

## Overview

### How It Works

1. **Landing Page** — Visitors see a fully animated branded landing page with smooth scroll-reveal sections covering Services, Features, Use Cases, and Pricing. A sticky header with desktop navigation links and a mobile sidebar are included.
2. **Sign Up** — A restaurant owner registers by providing a restaurant name, location, password, and brand color. They must accept the Terms and Conditions and Privacy Policy before submitting.
3. **Sign In** — Owners log in with their restaurant name and password. A "Remember Me" option saves credentials locally for faster future logins.
4. **Dashboard** — After signing in, the owner reaches their private dashboard. They can:
   - Create and manage **categories** (e.g., Starters, Mains, Desserts)
   - Add **food items** (with images, prices, and descriptions) inside each category
   - Open a **Share / QR Code** modal from the header to get a shareable public link
   - Visit **Settings** to update their brand color (with live preview) or reset their password
   - Go to **Payments** to view their plan status and payment instructions
   - On mobile, navigate via a **bottom tab bar** (Menu, Billing, Settings) and log out from the header
5. **Public Menu Page** — Anyone with the link (`/[restaurantName]`) can browse the menu. Categories are listed first; clicking a category shows its food items. The entire page is themed with the restaurant's chosen brand color. A **bottom tab navigation** is present on mobile for quick navigation.

### Pricing

| Plan | Price | Condition |
|------|-------|-----------|
| Basic | KES 1,500 (~$11.50 USD) | Up to 69 food items |
| Advanced | KES 2,000 (~$15.40 USD) | 70+ food items |

Payment is done manually via M-Pesa after menu creation. The restaurant sends proof to `kenyamenu8@gmail.com` or calls `+254704286209` for activation.

---

## Tech Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Framework  | Next.js 15 (App Router)               |
| Styling    | Tailwind CSS v4                       |
| State Mgmt | Zustand (with localStorage persistence) |
| Data Fetch | SWR (stale-while-revalidate)          |
| Icons      | react-icons (Feather + Lucide)        |
| Toasts     | react-hot-toast                       |
| HTTP       | Native fetch (wrapped in `api.js`)    |

---

## Getting Started

### Prerequisites

- Node.js 18+
- The `mymenu-api` backend running (see its own README)

### Installation

```bash
npm install
```

### Running the Dev Server

```bash
npm run dev
```

The app will be available at `http://localhost:3001` (or the next available port).

---

## Environment Variables

Create a `.env.local` file in the root of this project:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

This points the frontend at your local backend API server.

---

## Project Structure

```
mymenu/
├── public/                   # Static assets (logo, images)
├── src/
│   ├── app/                  # Next.js App Router pages and layouts
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # API client, utilities, constants
│   └── providers/            # React context providers
├── AGENTS.md                 # Project rules (Tailwind-only, no emojis, etc.)
├── next.config.mjs           # Next.js configuration
└── package.json
```

---

## src/app

This is the Next.js App Router directory. Every folder represents a route segment. Each `page.js` is a page and each `layout.js` wraps child pages.

```
src/app/
├── globals.css                    # Tailwind's @import directive + CSS theme tokens +
│                                  #   scroll-reveal keyframe animations (fadeUp, scaleIn)
├── icon.png                       # Browser tab favicon (auto-detected by Next.js)
├── layout.js                      # Root layout — wraps the entire app with ThemeProvider,
│                                  #   StatusProvider, and Toaster; sets <html> font classes;
│                                  #   injects JSON-LD structured data for AI/SEO bots;
│                                  #   includes a pre-paint script to apply the saved theme
│                                  #   before React hydrates to prevent flash-of-wrong-theme
├── page.js                        # Landing page — animated hero, Services, Features,
│                                  #   Use Cases, Pricing sections; sticky header with desktop
│                                  #   nav links; mobile sidebar navigation; footer with
│                                  #   links to Terms and Privacy Policy
├── robots.js                      # Generates /robots.txt — allows all crawlers on public
│                                  #   pages; blocks /dashboard/ from indexing
├── sitemap.js                     # Generates /sitemap.xml — lists all public pages for
│                                  #   search engines and AI bots to discover
│
├── signin/
│   └── page.js                    # Sign-in page — restaurant name + password form with
│                                  #   "Remember Me" checkbox that saves credentials to
│                                  #   localStorage for auto-fill on return visits
│
├── signup/
│   └── page.js                    # Sign-up page — registration form: restaurant name,
│                                  #   location, password, brand color picker, and a
│                                  #   mandatory Terms & Privacy consent checkbox
│
├── terms/
│   └── page.js                    # Terms and Conditions page — Kenya Data Protection
│                                  #   Act 2019 compliant; shows a dynamic last-updated date
│
├── privacy/
│   └── page.js                    # Privacy Policy page — Kenya Data Protection Act 2019
│                                  #   compliant; details data collection, usage, and rights
│
├── [restaurantName]/              # Dynamic public menu route (/MyRestaurant)
│   ├── page.js                    # Public category listing — shows all categories with
│                                  #   images; themed with the restaurant's brand color;
│                                  #   includes a mobile bottom tab navigation bar
│   └── [categoryName]/
│       └── page.js                # Public food items page — shows all items in a
│                                  #   category with images, prices, and descriptions;
│                                  #   clicking an item opens PublicItemModal;
│                                  #   includes a mobile bottom tab navigation bar
│
└── dashboard/                     # Private area (requires JWT, guarded by AuthGuard)
    ├── layout.js                  # Dashboard shell — collapsible sidebar for desktop;
    │                              #   mobile header with Share (QR) and red Logout button;
    │                              #   mobile bottom tab bar (Menu, Billing, Settings);
    │                              #   logout requires confirmation via a modal dialog;
    │                              #   shows an unpaid subscription warning banner;
    │                              #   injects restaurant brand color as a CSS variable
    ├── page.js                    # Dashboard home — lists all categories as cards with
    │                              #   images; supports creating, editing, and deleting
    │                              #   categories via CategoryModal and ConfirmModal
    ├── payments/
    │   └── page.js                # Payments page — displays plan status (Basic/Advanced),
    │                              #   pricing details, and M-Pesa payment instructions
    │                              #   with a copyable phone number
    └── settings/
        └── page.js                # Settings page — accordion-style layout with two
                                   #   sections: "Brand Color" (live preview + color picker
                                   #   with a sticky Save button) and "Reset Password"
                                   #   (with show/hide toggle and a confirmation modal);
                                   #   brand color updates use setState to surgically patch
                                   #   only primaryColor without corrupting other auth state
```

---

## src/components

Reusable UI components used across multiple pages.

```
src/components/
├── AuthGuard.jsx              # Protects dashboard routes — checks the Zustand auth store
│                              #   for a valid token; redirects to /signin if absent
│
├── CategoryModal.jsx          # Modal form for creating or editing a category —
│                              #   handles name input, image upload (via uploadService),
│                              #   and displays an image preview
│
├── ColorPicker.jsx            # Palette-based color selector — renders a grid of curated
│                              #   color swatches; used in the signup form and settings page
│
├── ConfirmModal.jsx           # Generic reusable confirmation dialog — accepts a title,
│                              #   message, and onConfirm callback; used before destructive
│                              #   actions like deleting a category or food item
│
├── EmptyState.jsx             # Displays a friendly "no data" illustration and message
│                              #   when a list (categories or food items) is empty
│
├── MenuItemModal.jsx          # Modal form for creating or editing a food item —
│                              #   handles food name, price, description, and image upload
│
├── PublicItemList.jsx         # Container that maps over food items and renders a
│                              #   PublicMenuItemCard for each item on the public menu page
│
├── PublicItemModal.jsx        # Modal shown when a customer taps a food item on the
│                              #   public menu — displays the full image, name, price,
│                              #   and description
│
├── PublicMenuItemCard.jsx     # Individual food item card on the public menu — shows
│                              #   a thumbnail image (lazy loaded), name, price, and
│                              #   a truncated description
│
├── ShareMenuModal.jsx         # Modal shown from the dashboard — displays the restaurant's
│                              #   public menu URL and a QR code for sharing; includes a
│                              #   copy-to-clipboard button for the shareable link
│
├── Skeleton.jsx               # Animated loading skeleton placeholder — used while
│                              #   data is being fetched from the API
│
└── ThemeToggle.jsx            # Light / Dark mode toggle button — reads and sets the
                               #   theme via the useTheme hook; persists preference to
                               #   localStorage; light mode is the app default
```

---

## src/hooks

Custom React hooks that encapsulate reusable logic.

```
src/hooks/
├── useAuthStore.js            # Zustand store for authentication state — holds the JWT
│                              #   token, refreshToken, restaurantName, primaryColor,
│                              #   isPaid, and subscriptionExpiresAt; persisted to
│                              #   localStorage under the key "mymenu-auth"; exposes
│                              #   login(), logout(), and updateTokens() actions;
│                              #   brand color updates should use useAuthStore.setState()
│                              #   directly to avoid corrupting other auth fields
│
└── useTheme.js                # Hook that reads/writes the current color theme
                               #   (light/dark) from localStorage and applies the
                               #   appropriate class to the <html> element; defaults
                               #   to light mode regardless of system preference
```

---

## src/lib

Utility modules, the API client, and shared constants.

```
src/lib/
├── api.js                     # Central API client — wraps the native fetch API;
│                              #   auto-attaches the JWT Authorization header from the
│                              #   auth store; handles 401/403 by logging the user out
│                              #   automatically; exposes all API methods:
│                              #     - auth: login, signup, resetPassword
│                              #     - profile: getProfile, updateProfile
│                              #     - categories: getCategories, createCategory,
│                              #                   updateCategory, deleteCategory
│                              #     - food items: getFoodItems, createFoodItem,
│                              #                   updateFoodItem, deleteFoodItem
│                              #     - image: uploadImage
│                              #     - public: getRestaurantMenu
│
├── index.js                   # Re-exports from lib for cleaner import paths
│
└── utils.js                   # General helper functions (e.g., groupItemsByCategory)
```

---

## src/providers

React context providers that wrap the application to supply global state and services.

```
src/providers/
├── StatusProvider.jsx         # Global loading/error overlay system — exposes
│                              #   showLoading(message), hideLoading(), and showError(message)
│                              #   via the useStatus() hook; renders a full-screen loading
│                              #   spinner overlay and a closable error modal
│
└── ThemeProvider.jsx          # Applies the active theme (light/dark) to the <html> element
                               #   on mount and whenever the theme preference changes;
                               #   light mode is the default; ignores system color-scheme
                               #   preference to keep the app consistently light by default
```

---

## Legal & Compliance

The platform complies with the **Kenya Data Protection Act No. 24 of 2019**.

- `/terms` — Full Terms and Conditions including usage rules, payment terms, and liability.
- `/privacy` — Privacy Policy covering what data is collected, how it's used, user rights, and contact details.
- Both pages display a **dynamically generated "last updated" date**.
- The **signup page** requires users to check a consent checkbox linking to both legal pages before they can create an account.

---

## SEO & AI Optimization

The app is optimized for both traditional search engines and AI crawlers (ChatGPT, Perplexity, Claude, etc.):

| Feature | File | Purpose |
|---------|------|---------|
| Rich metadata | `src/app/layout.js` | Title, description, and keyword tags |
| JSON-LD structured data | `src/app/layout.js` | Machine-readable schema.org data for AI bots |
| Sitemap | `src/app/sitemap.js` | Auto-generated `/sitemap.xml` listing all public pages |
| Robots rules | `src/app/robots.js` | Auto-generated `/robots.txt` — allows crawlers on public pages, blocks `/dashboard/` |
| Semantic HTML | All pages | Proper `<main>`, `<section>`, `<h1>`, `<h2>` hierarchy for easy AI parsing |
