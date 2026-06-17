"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut, FiCoffee, FiShare2, FiSettings, FiMenu, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";
import useAuthStore from "@/hooks/useAuthStore";
import ThemeToggle from "@/components/ThemeToggle";
import AuthGuard from "@/components/AuthGuard";
import ShareMenuModal from "@/components/ShareMenuModal";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { restaurantName, primaryColor, logout } = useAuthStore();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col md:flex-row bg-surface text-text">
        {/* Inject the restaurant's brand color as a CSS variable */}
        {primaryColor && (
          <style>{`:root { --theme-primary: ${primaryColor}; }`}</style>
        )}

        {/* Sidebar for Desktop (md and up) */}
        <aside className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-20 border-r border-border bg-surface p-4 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}>
          <div className="flex flex-col h-full justify-between">
            <div>
              {/* Collapse/Expand Toggle Button (No MyMenu brand text) */}
              <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-end"} mb-8 px-2`}>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg border border-border text-text hover:bg-surface-alt transition-colors"
                  title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
                </button>
              </div>

              {/* Desktop Nav Links */}
              <nav className="flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-primary-500/10 hover:text-primary-500 ${
                    isCollapsed ? "justify-center" : "gap-3"
                  } ${
                    pathname === "/dashboard"
                      ? "bg-primary-500/10 text-primary-500"
                      : "text-text-muted hover:text-text"
                  }`}
                  title="Categories"
                >
                  <FiCoffee size={18} className="shrink-0" />
                  {!isCollapsed && <span className="truncate">Categories</span>}
                </Link>
                <Link
                  href="/dashboard/settings"
                  className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-primary-500/10 hover:text-primary-500 ${
                    isCollapsed ? "justify-center" : "gap-3"
                  } ${
                    pathname === "/dashboard/settings"
                      ? "bg-primary-500/10 text-primary-500"
                      : "text-text-muted hover:text-text"
                  }`}
                  title="Settings"
                >
                  <FiSettings size={18} className="shrink-0" />
                  {!isCollapsed && <span className="truncate">Settings</span>}
                </Link>
                <Link
                  href={`/${restaurantName}`}
                  target="_blank"
                  className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium text-text-muted hover:bg-primary-500/10 hover:text-primary-500 transition-all duration-200 ${
                    isCollapsed ? "justify-center" : "gap-3"
                  }`}
                  title="View Public Menu"
                >
                  <FiShare2 size={18} className="shrink-0" />
                  {!isCollapsed && <span className="truncate">View Public Menu ↗</span>}
                </Link>
              </nav>
            </div>

            {/* Sidebar Bottom Controls */}
            <div className="border-t border-border pt-4 flex flex-col gap-3">
              <button
                onClick={() => setIsShareOpen(true)}
                className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium text-primary-500 bg-primary-500/10 hover:bg-primary-500 hover:text-white transition-all duration-200 ${
                  isCollapsed ? "justify-center" : "gap-3"
                }`}
                title="Share / QR"
              >
                <LuQrCode size={18} className="shrink-0" />
                {!isCollapsed && <span>Share QR</span>}
              </button>
              
              {isCollapsed ? (
                <div className="flex items-center justify-center p-2 bg-surface rounded-lg border border-border">
                  <ThemeToggle />
                </div>
              ) : (
                <div className="flex items-center justify-between px-4 py-2 bg-surface rounded-lg border border-border">
                  <span className="text-sm font-medium text-text-muted">Theme</span>
                  <ThemeToggle />
                </div>
              )}

              <button
                onClick={handleLogout}
                className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium text-text hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 border border-border bg-surface-alt ${
                  isCollapsed ? "justify-center" : "gap-3"
                }`}
                title="Logout"
              >
                <FiLogOut size={18} className="shrink-0" />
                {!isCollapsed && <span>Logout</span>}
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
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary-500/10 px-3 py-2 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-500 hover:text-white"
            >
              <LuQrCode size={16} />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-alt text-text transition-colors hover:bg-surface-elevated"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "md:pl-20" : "md:pl-64"} flex flex-col min-h-screen`}>
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl w-full mx-auto">
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

        {/* Mobile Slide-out Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Slide-out Panel */}
        <div 
          className={`fixed inset-y-0 right-0 z-50 w-64 bg-surface shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-border">
            <span className="font-bold text-text text-lg">Menu</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 -mr-2 text-text-muted hover:text-text hover:bg-surface-alt rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <nav className="flex flex-col gap-2 p-4 text-sm font-medium flex-1">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${pathname === '/dashboard' ? 'bg-primary-500/10 text-primary-500' : 'text-text hover:bg-surface-alt'}`}
            >
              <FiCoffee size={18} />
              Categories
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${pathname === '/dashboard/settings' ? 'bg-primary-500/10 text-primary-500' : 'text-text hover:bg-surface-alt'}`}
            >
              <FiSettings size={18} />
              Settings
            </Link>
            <Link
              href={`/${restaurantName}`}
              target="_blank"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-text hover:bg-surface-alt transition-colors"
            >
              <FiShare2 size={18} />
              View Public Menu ↗
            </Link>
            
            <div className="mt-auto border-t border-border pt-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Share Modal */}
        <ShareMenuModal 
          isOpen={isShareOpen} 
          onClose={() => setIsShareOpen(false)} 
          restaurantName={restaurantName} 
        />
      </div>
    </AuthGuard>
  );
}
