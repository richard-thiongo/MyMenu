"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiLoader, FiCheckCircle } from "react-icons/fi";
import { api } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import { useStatus } from "@/providers/StatusProvider";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showLoading, hideLoading, showError } = useStatus();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    showLoading("Sending reset link...");
    try {
      await api.forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      showError(error.message || "Failed to request password reset. Please try again.");
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-logo text-3xl text-primary-500">
          Kenyan.menu
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-surface-alt p-8 shadow-xl">
          {isSubmitted ? (
            <div className="text-center space-y-6 py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <FiCheckCircle size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text mb-2">Check your email inbox</h2>
                <p className="text-sm text-text-muted">
                  If an account exists for <span className="font-medium text-text">{email}</span>, 
                  you will receive a password reset link shortly.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/signin"
                  className="flex w-full justify-center items-center rounded-lg bg-surface border border-border px-4 py-3 text-sm font-semibold text-text transition-colors hover:bg-surface-elevated"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-center text-3xl font-extrabold text-text">
                  Forgot Password?
                </h2>
                <p className="mt-2 text-center text-sm text-text-muted">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-text-muted" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiMail className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="block w-full rounded-lg border border-border bg-surface pl-10 pr-3 py-3 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="e.g. hello@pastapalace.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="flex w-full justify-center items-center rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </div>
                
                <div className="text-center text-sm">
                  <Link href="/signin" className="font-medium text-text-muted hover:text-primary-500 transition-colors">
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
