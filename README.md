# MyMenu - Frontend

MyMenu is a full-stack digital menu platform that lets restaurant owners register their business, build their menu, and share it publicly via a branded link or QR code. Customers can scan a QR code or visit the link to browse the menu in a clean, mobile-friendly interface — no app download required.

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

---

## Overview

### How It Works

1. **Landing Page** — Visitors see a branded landing page with call-to-action buttons to sign up or log in.
2. **Sign Up** — A restaurant owner registers by providing a restaurant name, location, password, and a brand color. The brand color themes their public menu page.
3. **Sign In** — Owners log in with their restaurant name and password. A "Remember Me" option saves credentials locally for faster future logins.
4. **Dashboard** — After signing in, the owner reaches their private dashboard. They can:
   - Create and manage **categories** (e.g., Starters, Mains, Desserts)
   - Add **food items** (with images, prices, and descriptions) inside each category
   - Open a **Share / QR Code** modal to get a shareable public link
   - Visit **Settings** to update their brand color or reset their password
5. **Public Menu Page** — Anyone with the link (`/[restaurantName]`) can browse the menu. Categories are listed first; clicking a category shows its food items with images, prices, and descriptions. The entire page is themed with the restaurant's chosen brand color.

---

## Tech Stack

| Layer      | Technology                      |
|------------|---------------------------------|
| Framework  | Next.js 15 (App Router)         |
| Styling    | Tailwind CSS v4                 |
| State Mgmt | Zustand (with localStorage persistence) |
| Data Fetch | SWR (stale-while-revalidate)    |
| Icons      | react-icons (Feather + Lucide)  |
| Toasts     | react-hot-toast                 |
| HTTP       | Native fetch (wrapped in api.js) |

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
├── public/                   # Static assets (logo, favicon)
├── src/
│   ├── app/                  # Next.js App Router pages and layouts
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # API client, utilities, constants
│   └── providers/            # React context providers
├── AGENTS.md                 # Project rules (Tailwind-only, no emojis, etc.)
├── next.config.mjs           # Next.js configuration
├── package.json
└── tailwind.config.js        # Auto-managed by Tailwind v4
```

---

## src/app

This is the Next.js App Router directory. Every folder represents a route segment. Each `page.js` is a page and each `layout.js` wraps child pages.

```
src/app/
├── globals.css                    # Tailwind's @import directive + CSS theme tokens
├── icon.png                       # Browser tab favicon (auto-detected by Next.js)
├── layout.js                      # Root layout — wraps entire app with ThemeProvider,
│                                  #   StatusProvider, and Toaster; sets <html> font class
├── page.js                        # Landing page — hero section with "Get Started" and
│                                  #   "Login" CTAs, logo, and footer
│
├── signin/
│   └── page.js                    # Sign-in page — restaurant name + password form with
│                                  #   "Remember Me" checkbox that saves credentials to
│                                  #   localStorage for auto-fill on return visits
│
├── signup/
│   └── page.js                    # Sign-up page — registration form: restaurant name,
│                                  #   location, password, and brand color picker modal
│
├── [restaurantName]/              # Dynamic public menu route (/MyRestaurant)
│   ├── page.js                    # Public category listing — shows all categories with
│                                  #   images; the entire page is themed using the
│                                  #   restaurant's primary_color CSS variable
│   └── [categoryName]/
│       └── page.js                # Public food items page — shows all items in a
│                                  #   category with images, prices, and descriptions;
│                                  #   clicking an item opens PublicItemModal
│
└── dashboard/                     # Private area (requires JWT, guarded by AuthGuard)
    ├── layout.js                  # Dashboard shell — collapsible left sidebar with nav
    │                              #   links (Categories, Share/QR, Settings, Logout);
    │                              #   shows restaurant name at the top; injects brand
    │                              #   color CSS variable for theming
    ├── page.js                    # Dashboard home — lists all categories as cards with
    │                              #   images; supports creating, editing, and deleting
    │                              #   categories via CategoryModal and ConfirmModal
    └── settings/
        └── page.js                # Settings page — accordion-style layout with two
                                   #   sections: "Brand Color" (live preview + color picker)
                                   #   and "Reset Password" (with show/hide toggle and a
                                   #   confirmation modal before applying the change)
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
│                              #   color swatches; used in the signup modal and settings page
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
├── ShareMenuModal.jsx         # Modal shown from the dashboard sidebar — displays the
│                              #   restaurant's public menu URL and a QR code for sharing;
│                              #   includes a copy-to-clipboard button
│
├── Skeleton.jsx               # Animated loading skeleton placeholder — used while
│                              #   data is being fetched from the API
│
└── ThemeToggle.jsx            # Light / Dark mode toggle button — reads and sets the
                               #   theme via the useTheme hook; persists preference
```

---

## src/hooks

Custom React hooks that encapsulate reusable logic.

```
src/hooks/
├── useAuthStore.js            # Zustand store for authentication state — holds the JWT
│                              #   token, restaurantName, and primaryColor; persisted to
│                              #   localStorage under the key "mymenu-auth"; exposes
│                              #   login() and logout() actions
│
└── useTheme.js                # Hook that reads/writes the current color theme
                               #   (light/dark) from localStorage and applies the
                               #   appropriate class to the <html> element
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
└── utils.js                   # General helper functions (e.g., formatting, string utils)
```

---

## src/providers

React context providers that wrap the application to supply global state and services.

```
src/providers/
├── StatusProvider.jsx         # Global loading/error overlay system — exposes
│                              #   showLoading(message), hideLoading(), and showError(message)
│                              #   via the useStatus() hook; renders a full-screen loading
│                              #   spinner overlay and a closable error modal so pages don't
│                              #   need to manage their own global error UI
│
└── ThemeProvider.jsx          # Applies the active theme (light/dark) to the <html> element
                               #   on mount and whenever the theme preference changes;
                               #   also injects the restaurant's brand color as a CSS
                               #   custom property (--theme-primary) for use in Tailwind
                               #   utility classes and custom styles
```
