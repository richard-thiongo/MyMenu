"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiLock, FiUser, FiLoader, FiEye, FiEyeOff } from "react-icons/fi";
import { api } from "@/lib/api";
import useAuthStore from "@/hooks/useAuthStore";
import ThemeToggle from "@/components/ThemeToggle";

import { useStatus } from "@/providers/StatusProvider";

export default function SigninPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);
  
  const [formData, setFormData] = useState({
    restaurant_name: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { showLoading, hideLoading, showError } = useStatus();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  useEffect(() => {
    const saved = localStorage.getItem("mymenu-remembered-credentials");
    if (saved) {
      try {
        const { restaurant_name, password } = JSON.parse(saved);
        setFormData({ restaurant_name, password });
        setRememberMe(true);
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.restaurant_name || !formData.password) {
      showError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    showLoading("Signing in...");
    try {
      const res = await api.login(formData);
      // The API returns { message, data: { token, refreshToken, restaurant } }
      if (res.data && res.data.token) {
        const token = res.data.token;
        const refreshToken = res.data.refreshToken;
        const name = res.data.restaurant?.restaurant_name || formData.restaurant_name;
        const primaryColor = res.data.restaurant?.primary_color || null;
        const isPaid = res.data.restaurant?.is_paid || false;
        const subExp = res.data.restaurant?.subscription_expires_at || null;
        login(token, refreshToken, name, primaryColor, isPaid, subExp);

        if (rememberMe) {
          localStorage.setItem("mymenu-remembered-credentials", JSON.stringify({
            restaurant_name: formData.restaurant_name,
            password: formData.password
          }));
        } else {
          localStorage.removeItem("mymenu-remembered-credentials");
        }

        toast.success(`Welcome back, ${name}!`);
        router.push("/dashboard");
      } else {
        showError("Invalid response from server.");
      }
    } catch (error) {
      showError(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-primary-500">
          Kenyan.menu
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-surface-alt p-8 shadow-xl">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-text">
              Sign In
            </h2>
            <p className="mt-2 text-center text-sm text-text-muted">
              Access your restaurant dashboard
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted" htmlFor="restaurant_name">
                  Restaurant Name
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiUser className="h-5 w-5 text-text-muted" />
                  </div>
                  <input
                    id="restaurant_name"
                    name="restaurant_name"
                    type="text"
                    required
                    className="block w-full rounded-lg border border-border bg-surface px-10 py-3 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Enter your restaurant name"
                    value={formData.restaurant_name}
                    onChange={(e) => setFormData({ ...formData, restaurant_name: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted" htmlFor="password">
                  Password
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
                    className="block w-full rounded-lg border border-border bg-surface pl-10 pr-12 py-3 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-border bg-surface text-primary-500 focus:ring-primary-500"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-text-muted">
                    Remember me
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
            
            <div className="text-center text-sm text-text-muted">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-primary-500 hover:text-primary-600">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
