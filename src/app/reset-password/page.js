"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiLock, FiLoader, FiEye, FiEyeOff } from "react-icons/fi";
import { api } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import { useStatus } from "@/providers/StatusProvider";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showLoading, hideLoading, showError } = useStatus();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showError("Invalid or missing reset token.");
      return;
    }
    if (password.length < 8) {
      showError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    showLoading("Resetting password...");
    try {
      await api.resetPasswordWithToken(token, password);
      toast.success("Password reset successfully! You can now sign in.");
      router.push("/signin");
    } catch (error) {
      showError(error.message || "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col bg-surface text-text">
        <header className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-logo text-3xl text-primary-500">OurMenu.Click</Link>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-surface-alt p-8 shadow-xl text-center">
            <h2 className="text-2xl font-bold text-text">Invalid Link</h2>
            <p className="text-text-muted">This password reset link is invalid or missing the security token.</p>
            <Link href="/forgot-password" className="inline-block mt-4 rounded-lg bg-primary-500 px-6 py-2 text-white font-medium hover:bg-primary-600">
              Request New Link
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-logo text-3xl text-primary-500">
          OurMenu.Click
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-surface-alt p-8 shadow-xl">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-text">
              Choose New Password
            </h2>
            <p className="mt-2 text-center text-sm text-text-muted">
              Enter a strong password for your account
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted" htmlFor="password">
                  New Password
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiLock className="h-5 w-5 text-text-muted" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    className="block w-full rounded-lg border border-border bg-surface pl-10 pr-12 py-3 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-primary-500 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiLock className="h-5 w-5 text-text-muted" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    className="block w-full rounded-lg border border-border bg-surface pl-10 pr-12 py-3 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || password !== confirmPassword || password.length < 8}
                className="flex w-full justify-center items-center rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="mr-2 h-5 w-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-surface text-text">
        <FiLoader className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
