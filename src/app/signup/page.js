"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiLock, FiUser, FiMapPin, FiLoader, FiEye, FiEyeOff, FiDroplet, FiX } from "react-icons/fi";
import { api } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import ColorPicker from "@/components/ColorPicker";
import useAuthStore from "@/hooks/useAuthStore";


import { useStatus } from "@/providers/StatusProvider";

export default function SignupPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  
  const [formData, setFormData] = useState({
    restaurant_name: "",
    location: "",
    password: "",
    primary_color: "#6366f1",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [tempColor, setTempColor] = useState("#6366f1");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { showLoading, hideLoading, showError } = useStatus();

  const openColorModal = () => {
    setTempColor(formData.primary_color);
    setIsColorModalOpen(true);
  };

  const closeColorModal = () => {
    setIsColorModalOpen(false);
  };

  const applyColor = () => {
    setFormData({ ...formData, primary_color: tempColor });
    setIsColorModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.restaurant_name || !formData.location || !formData.password) {
      showError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    showLoading("Creating account...");
    try {
      await api.signup(formData);
      toast.success("Account created successfully! Please sign in.");
      router.push("/signin");
    } catch (error) {
      showError(error.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  if (token) {
    return null;
  }

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
              Register Restaurant
            </h2>
            <p className="mt-2 text-center text-sm text-text-muted">
              Create your digital menu today
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
                    placeholder="e.g. Pasta Palace"
                    value={formData.restaurant_name}
                    onChange={(e) => setFormData({ ...formData, restaurant_name: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted" htmlFor="location">
                  Location
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiMapPin className="h-5 w-5 text-text-muted" />
                  </div>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    className="block w-full rounded-lg border border-border bg-surface px-10 py-3 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="e.g. New York, NY"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                    minLength={8}
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
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Brand Color
              </label>
              <button
                type="button"
                onClick={openColorModal}
                disabled={isLoading}
                className="w-full flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-6 w-6 rounded-md shadow-sm border border-black/10"
                    style={{ backgroundColor: formData.primary_color }}
                  />
                  <span className="text-sm font-medium text-text">Choose a color</span>
                </div>
                <FiDroplet className="text-text-muted" />
              </button>
              <p className="mt-2 text-xs text-text-muted">This color will theme your public menu page.</p>
            </div>

            <div className="sticky bottom-0 z-10 border-t border-border bg-surface-alt/95 backdrop-blur-sm px-8 py-6 -mx-8 -mb-8 mt-8 rounded-b-2xl">
              {/* Terms Consent */}
              <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-alt p-4">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary-500 cursor-pointer"
                />
                <label htmlFor="agree-terms" className="text-xs text-text-muted leading-relaxed cursor-pointer">
                  I have read and agree to the{" "}
                  <Link href="/terms" target="_blank" className="font-semibold text-primary-500 hover:underline">Terms and Conditions</Link>
                  {" "}and the{" "}
                  <Link href="/privacy" target="_blank" className="font-semibold text-primary-500 hover:underline">Privacy Policy</Link>.
                  I consent to Kenyan.menu processing my business information as described therein, in accordance with the Kenya Data Protection Act 2019.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !agreedToTerms}
                className="flex w-full justify-center items-center rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
            
            <div className="text-center text-sm text-text-muted">
              Already have an account?{" "}
              <Link href="/signin" className="font-medium text-primary-500 hover:text-primary-600">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Color Picker Modal */}
      {isColorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-surface shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex-none p-6 pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text">Select Brand Color</h3>
                <button
                  type="button"
                  onClick={closeColorModal}
                  className="rounded-lg p-2 text-text-muted hover:bg-surface-alt hover:text-text transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <ColorPicker 
                color={tempColor}
                onChange={setTempColor}
                disabled={false}
              />
            </div>

            <div className="flex-none p-6 pt-4 border-t border-border bg-surface flex gap-3">
              <button
                type="button"
                onClick={closeColorModal}
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 font-medium text-text transition-colors hover:bg-surface-alt"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyColor}
                className="flex-1 rounded-lg bg-primary-500 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
