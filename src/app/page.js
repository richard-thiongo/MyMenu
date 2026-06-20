"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import useAuthStore from "@/hooks/useAuthStore";

export default function Home() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/logo.png"
            alt="Kenyan.menu logo"
            width={32}
            height={32}
            className="rounded-lg sm:h-10 sm:w-10"
            priority
          />
          <span className="rounded-lg border border-primary-500/20 bg-primary-500/10 px-3 py-1 text-lg font-bold tracking-tight text-primary-500 dark:text-white sm:text-xl">
            Kenyan.menu
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
            <Link href="/signin" className="text-text-muted hover:text-primary-500 transition-colors">
              Log in
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-4xl flex-col items-center gap-8 sm:gap-10 text-center">
          <div className="relative mt-8 sm:mt-0">
            <div className="absolute -inset-4 rounded-3xl bg-primary-500/10 blur-2xl" />
            <Image
              src="/logo.png"
              alt="Kenyan.menu brand"
              width={100}
              height={100}
              className="relative rounded-2xl sm:h-[120px] sm:w-[120px]"
            />
          </div>

          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <h1 className="mt-4 flex flex-col items-center gap-3 text-3xl font-extrabold leading-tight tracking-tight sm:flex-row sm:gap-4 sm:text-5xl lg:text-6xl">
              <span>Welcome to</span>
              <span className="inline-block rounded-2xl bg-primary-500 px-6 py-2 text-white shadow-lg shadow-primary-500/25">
                Kenyan.menu
              </span>
            </h1>
            <p className="max-w-xs sm:max-w-md lg:max-w-xl text-base sm:text-lg leading-relaxed text-text-muted">
              Your smart digital menu companion. Register your restaurant, build your menu, and share it instantly.
            </p>
          </div>

          <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              id="cta-explore"
              href="/signup"
              className="flex w-full sm:w-auto h-12 sm:h-14 items-center justify-center rounded-full bg-primary-500 px-8 text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 active:scale-95"
            >
              Get Started
            </Link>
            <Link
              id="cta-learn-more"
              href="/signin"
              className="flex w-full sm:w-auto h-12 sm:h-14 items-center justify-center rounded-full border-2 border-border bg-surface-alt px-8 text-base sm:text-lg font-semibold text-text transition-all duration-300 hover:border-primary-400 hover:text-primary-500 active:scale-95"
            >
              Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-alt px-4 py-6 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-text-muted">
        Kenyan.menu
      </footer>
    </div>
  );
}
