"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut, FiCoffee, FiShare2, FiSettings, FiMenu, FiX, FiChevronLeft, FiChevronRight, FiCreditCard, FiAlertCircle, FiClipboard } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";
import useAuthStore from "@/hooks/useAuthStore";
import ThemeToggle from "@/components/ThemeToggle";
import AuthGuard from "@/components/AuthGuard";
import ShareMenuModal from "@/components/ShareMenuModal";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { restaurantName, primaryColor, logout, isPaid, subscriptionExpiresAt } = useAuthStore();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  useEffect(() => {
    import("@/lib/api").then(({ api }) => {
      api.getProfile().then((res) => {
        if (res && res.data) {
          // Always sync from the server — this heals any corrupted localStorage values
          // (e.g. restaurantName showing a hex color due to a previous login() arg mismatch)
          useAuthStore.setState({
            restaurantName: res.data.restaurant_name ?? useAuthStore.getState().restaurantName,
            primaryColor: res.data.primary_color ?? useAuthStore.getState().primaryColor,
            isPaid: res.data.is_paid,
            subscriptionExpiresAt: res.data.subscription_expires_at,
          });
        }
      }).catch(() => { });
    });
  }, []);

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col md:flex-row bg-surface text-text">
        {/* Inject the restaurant's brand color as a CSS variable */}
        {primaryColor && (
          <style>{`:root { --theme-primary: ${primaryColor}; }`}</style>
        )}

        {/* Sidebar for Desktop (md and up) */}
        <aside 
          onMouseEnter={() => setIsCollapsed(false)}
          onMouseLeave={() => setIsCollapsed(true)}
          className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-20 border-r border-border bg-surface p-4 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
          }`}>
          <div className="flex flex-col h-full justify-between">
            <div>
              {/* Desktop Nav Links */}
              <nav className="flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-primary-500/10 hover:text-primary-500 ${isCollapsed ? "justify-center" : "gap-3"
                    } ${pathname === "/dashboard"
                      ? "bg-primary-500 text-white"
                      : "text-text-muted hover:text-text"
                    }`}
                  title="Categories"
                >
                  <FiCoffee size={18} className="shrink-0" />
                  <span className={`truncate ${isCollapsed ? 'hidden' : 'block'}`}>Categories</span>
                </Link>
                <Link
                  href="/dashboard/orders"
                  className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-primary-500/10 hover:text-primary-500 ${isCollapsed ? "justify-center" : "gap-3"
                    } ${pathname === "/dashboard/orders"
                      ? "bg-primary-500 text-white"
                      : "text-text-muted hover:text-text"
                    }`}
                  title="Orders"
                >
                  <FiClipboard size={18} className="shrink-0" />
                  <span className={`truncate ${isCollapsed ? 'hidden' : 'block'}`}>Orders</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-primary-500/10 hover:text-primary-500 ${isCollapsed ? "justify-center" : "gap-3"
                    } ${pathname === "/dashboard/settings"
                      ? "bg-primary-500 text-white"
                      : "text-text-muted hover:text-text"
                    }`}
                  title="Settings"
                >
                  <FiSettings size={18} className="shrink-0" />
                  <span className={`truncate ${isCollapsed ? 'hidden' : 'block'}`}>Settings</span>
                </Link>
                <Link
                  href="/dashboard/payments"
                  className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-primary-500/10 hover:text-primary-500 ${isCollapsed ? "justify-center" : "gap-3"
                    } ${pathname === "/dashboard/payments"
                      ? "bg-primary-500 text-white"
                      : "text-text-muted hover:text-text"
                    }`}
                  title="Payments"
                >
                  <FiCreditCard size={18} className="shrink-0" />
                  <span className={`truncate ${isCollapsed ? 'hidden' : 'block'}`}>Payments</span>
                </Link>
                <Link
                  href={`/${restaurantName}`}
                  target="_blank"
                  className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium text-text-muted hover:bg-primary-500/10 hover:text-primary-500 transition-all duration-200 ${isCollapsed ? "justify-center" : "gap-3"
                    }`}
                  title="View Public Menu"
                >
                  <FiShare2 size={18} className="shrink-0" />
                  <span className={`truncate ${isCollapsed ? 'hidden' : 'block'}`}>View Public Menu ↗</span>
                </Link>
              </nav>
            </div>

            {/* Sidebar Bottom Controls */}
            <div className="border-t border-border pt-4 flex flex-col gap-3">
              <button
                onClick={() => setIsShareOpen(true)}
                className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium text-primary-500 bg-primary-500/10 hover:bg-primary-500 hover:text-white transition-all duration-200 ${isCollapsed ? "justify-center" : "gap-3"
                  }`}
                title="Share / QR"
              >
                <LuQrCode size={18} className="shrink-0" />
                <span className={isCollapsed ? 'hidden' : 'block'}>Share QR</span>
              </button>

              <div className={`flex items-center ${isCollapsed ? "justify-center p-2" : "justify-between px-4 py-2"} bg-surface rounded-lg border border-border`}>
                <span className={`text-sm font-medium text-text-muted ${isCollapsed ? 'hidden' : 'block'}`}>Theme</span>
                <ThemeToggle />
              </div>

              {/* Language switcher — desktop sidebar only */}
              <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                <LanguageSwitcher openUpwards={true} iconOnly={isCollapsed} className={isCollapsed ? "" : "w-full"} />
              </div>

              <button
                onClick={() => setIsLogoutConfirmOpen(true)}
                className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium text-text hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 border border-border bg-surface-alt ${isCollapsed ? "justify-center" : "gap-3"
                  }`}
                title="Logout"
              >
                <FiLogOut size={18} className="shrink-0" />
                <span className={isCollapsed ? 'hidden' : 'block'}>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Header (hidden on md and up) */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-md">
          <span className="text-lg font-bold tracking-tight text-primary-500">
            Dashboard
          </span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary-500/10 px-3 py-2 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-500 hover:text-white"
              title="Share"
            >
              <LuQrCode size={16} />
              <span className="text-xs font-bold">Share</span>
            </button>
            <button
              onClick={() => setIsLogoutConfirmOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-alt text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 transition-colors"
              title="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "md:pl-20" : "md:pl-64"} flex flex-col min-h-screen`}>
          <main className="flex-1 px-4 py-8 pb-24 md:pb-8 sm:px-6 lg:px-8 max-w-5xl w-full mx-auto">
            {(!isPaid || (subscriptionExpiresAt && new Date(subscriptionExpiresAt) < new Date())) && (
              <div className="mb-6 rounded-lg bg-amber-500/10 p-4 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiAlertCircle className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-medium">Your subscription is inactive. Your public menu is currently hidden.</p>
                </div>
                <Link href="/dashboard/payments" className="shrink-0 text-sm font-bold underline hover:text-amber-600 dark:hover:text-amber-300">
                  Verify Payment
                </Link>
              </div>
            )}
            {/* Restaurant Name Title at the Top of the Body */}
            <div className="mb-8 border-b border-border pb-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-text">
                {restaurantName}
              </h1>
              <p className="mt-1 text-sm text-text-muted">
                Manage your digital menu and settings
              </p>
            </div>
            {children}
          </main>
        </div>
        {/* Mobile Bottom Navigation (hidden on md and up) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-surface/90 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${pathname === '/dashboard' ? 'text-primary-500' : 'text-text-muted hover:text-text'}`}
          >
            <FiCoffee size={20} />
            <span className="text-[10px] font-medium uppercase tracking-wider">Menu</span>
          </Link>
          <Link
            href="/dashboard/orders"
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${pathname === '/dashboard/orders' ? 'text-primary-500' : 'text-text-muted hover:text-text'}`}
          >
            <FiClipboard size={20} />
            <span className="text-[10px] font-medium uppercase tracking-wider">Orders</span>
          </Link>
          <Link
            href="/dashboard/payments"
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${pathname === '/dashboard/payments' ? 'text-primary-500' : 'text-text-muted hover:text-text'}`}
          >
            <FiCreditCard size={20} />
            <span className="text-[10px] font-medium uppercase tracking-wider">Billing</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${pathname === '/dashboard/settings' ? 'text-primary-500' : 'text-text-muted hover:text-text'}`}
          >
            <FiSettings size={20} />
            <span className="text-[10px] font-medium uppercase tracking-wider">Settings</span>
          </Link>
        </nav>

        {/* Share Modal */}
        <ShareMenuModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          restaurantName={restaurantName}
        />

        {/* Logout Confirmation Modal */}
        {isLogoutConfirmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsLogoutConfirmOpen(false)}
            />
            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface p-6 text-center shadow-2xl animate-in zoom-in-95">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <FiLogOut size={24} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-text">Sign Out</h3>
              <p className="mb-6 text-sm text-text-muted">
                Are you sure you want to log out of your account? You will need to sign in again to access your dashboard.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setIsLogoutConfirmOpen(false)}
                  className="flex-1 rounded-xl border border-border bg-surface-alt py-3 font-bold text-text transition-colors hover:bg-surface-elevated active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsLogoutConfirmOpen(false);
                    handleLogout();
                  }}
                  className="flex-1 rounded-xl bg-red-500 py-3 font-bold text-white transition-colors hover:bg-red-600 active:scale-95 shadow-lg shadow-red-500/30"
                >
                  Yes, Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
