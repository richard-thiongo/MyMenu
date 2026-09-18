"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiLock, FiUser, FiMapPin, FiLoader, FiEye, FiEyeOff, FiDroplet, FiX, FiMail, FiArrowRight, FiArrowLeft, FiCheck } from "react-icons/fi";
import emailValidator from "email-validator";
import { api } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import ColorPicker from "@/components/ColorPicker";
import useAuthStore from "@/hooks/useAuthStore";
import { useStatus } from "@/providers/StatusProvider";

const STEPS = [
  { label: "Name" },
  { label: "Link" },
  { label: "Location" },
  { label: "Color" },
  { label: "Email" },
  { label: "Password" },
];

export default function SignupPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) router.push("/dashboard");
  }, [token, router]);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    restaurant_name: "",
    username: "",
    restaurant_email: "",
    location: "",
    password: "",
    primary_color: "#6366f1",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [tempColor, setTempColor] = useState("#6366f1");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { showLoading, hideLoading, showError } = useStatus();

  const openColorModal = () => { setTempColor(formData.primary_color); setIsColorModalOpen(true); };
  const closeColorModal = () => setIsColorModalOpen(false);
  const applyColor = () => { setFormData({ ...formData, primary_color: tempColor }); setIsColorModalOpen(false); };

  const handleNextStep = () => {
    if (currentStep === 1 && !formData.restaurant_name) { showError("Enter your restaurant name."); return; }
    if (currentStep === 2 && !formData.username) { showError("Enter a username for your link."); return; }
    if (currentStep === 3 && !formData.location) { showError("Enter your location."); return; }
    if (currentStep === 5) {
      if (!formData.restaurant_email) { showError("Enter your email."); return; }
      if (!emailValidator.validate(formData.restaurant_email)) { showError("Enter a valid email."); return; }
    }
    if (currentStep < totalSteps) setCurrentStep((p) => p + 1);
  };

  const handlePrevStep = () => { if (currentStep > 1) setCurrentStep((p) => p - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== totalSteps) { handleNextStep(); return; }
    if (formData.password.length < 8) { showError("Password must be at least 8 characters."); return; }
    if (formData.password !== confirmPassword) { showError("Passwords do not match."); return; }
    if (!agreedToTerms) { showError("You must agree to the terms."); return; }

    setIsLoading(true);
    showLoading("Creating account...");
    try {
      await api.signup(formData);
      toast.success("Account created! Please sign in.");
      router.push("/signin");
    } catch (error) {
      showError(error.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  if (token) return null;

  return (
    <div className="flex min-h-screen bg-surface text-text overflow-hidden">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900 flex-col justify-center items-center overflow-hidden">
        <img
          src="/retaurant 2.jpg"
          alt="Restaurant background"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent" />
        <div className="relative z-10 max-w-lg p-12 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-6 font-[family-name:var(--font-playfair)] tracking-tight">
            Join OurMenu.Click
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Set up your digital menu in minutes. Share it via QR code or link instantly.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full lg:w-1/2 flex-col overflow-y-auto">
        <header className="flex items-center justify-between px-6 py-6 lg:px-12 lg:py-8">
          <Link href="/" className="font-logo text-3xl text-primary-500 transition-transform hover:scale-105">
            OurMenu.Click
          </Link>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center px-6 sm:px-12 pb-16">
          <div className="w-full max-w-md">

            {/* Step Progress */}
            <div className="mb-10">
              <div className="flex items-start justify-between mb-3">
                {STEPS.map((s, i) => {
                  const step = i + 1;
                  const isDone = step < currentStep;
                  const isActive = step === currentStep;
                  return (
                    <div key={step} className="flex flex-col items-center flex-1">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                        isActive ? "bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-110"
                        : isDone ? "bg-primary-500 text-white"
                        : "bg-surface border border-border text-text-muted"
                      }`}>
                        {isDone ? <FiCheck size={13} /> : step}
                      </div>
                      <span className={`mt-1.5 text-[10px] font-semibold transition-colors ${isActive ? "text-primary-500" : isDone ? "text-primary-400" : "text-text-muted"}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="relative h-1.5 bg-border rounded-full">
                <div
                  className="absolute left-0 top-0 h-1.5 bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-text tracking-tight">
                {currentStep === 1 && "Restaurant Name"}
                {currentStep === 2 && "Your Link"}
                {currentStep === 3 && "Location"}
                {currentStep === 4 && "Brand Color"}
                {currentStep === 5 && "Email"}
                {currentStep === 6 && "Set Password"}
              </h2>
              <p className="text-sm text-text-muted mt-1">
                {currentStep === 1 && "What's the name of your restaurant?"}
                {currentStep === 2 && "Choose your custom menu link."}
                {currentStep === 3 && "Your city or area."}
                {currentStep === 4 && "Pick your menu theme color."}
                {currentStep === 5 && "Used for account recovery."}
                {currentStep === 6 && "At least 8 characters."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* STEP 1 */}
              {currentStep === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiUser className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                      id="restaurant_name"
                      name="restaurant_name"
                      type="text"
                      autoFocus
                      required
                      className="block w-full rounded-lg border border-border bg-surface px-10 py-3 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="Restaurant Name (e.g. Kenya Cafe)"
                      value={formData.restaurant_name}
                      onChange={(e) => setFormData({ ...formData, restaurant_name: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                  {formData.username && (
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-2 rounded-lg border border-green-200 dark:border-green-500/20 flex items-center gap-2">
                      <FiCheck size={14} />
                      {typeof window !== 'undefined' ? window.location.host : 'mymenu.app'}/{formData.username}
                    </p>
                  )}
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiUser className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoFocus
                      required
                      className="block w-full rounded-lg border border-border bg-surface px-10 py-3 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="Username for your link (e.g. kenyacafe)"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.replace(/\s+/g, '').toLowerCase() })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiMapPin className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      autoFocus
                      required
                      className="block w-full rounded-lg border border-border bg-surface px-10 py-3 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="e.g. Nairobi, CBD"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {currentStep === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <button
                    type="button"
                    onClick={openColorModal}
                    disabled={isLoading}
                    className="w-full flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-7 w-7 rounded-md shadow-sm border border-black/10"
                        style={{ backgroundColor: formData.primary_color }}
                      />
                      <span className="text-sm font-medium text-text">Choose color</span>
                    </div>
                    <FiDroplet className="text-text-muted" />
                  </button>
                </div>
              )}

              {/* STEP 5 */}
              {currentStep === 5 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiMail className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                      id="restaurant_email"
                      name="restaurant_email"
                      type="email"
                      autoFocus
                      required
                      className="block w-full rounded-lg border border-border bg-surface px-10 py-3 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="e.g. hello@kenyacafe.com"
                      value={formData.restaurant_email}
                      onChange={(e) => setFormData({ ...formData, restaurant_email: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* STEP 6 */}
              {currentStep === 6 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiLock className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoFocus
                      className="block w-full rounded-lg border border-border bg-surface pl-10 pr-12 py-3 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="Password"
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

                  <div className="relative">
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
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
                    <input
                      id="agree-terms"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary-500 cursor-pointer"
                    />
                    <label htmlFor="agree-terms" className="text-xs text-text-muted leading-relaxed cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" target="_blank" className="font-semibold text-primary-500 hover:underline">Terms</Link>
                      {" "}and{" "}
                      <Link href="/privacy" target="_blank" className="font-semibold text-primary-500 hover:underline">Privacy Policy</Link>.
                    </label>
                  </div>
                </div>
              )}

              {/* NAVIGATION */}
              <div className="pt-4 flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isLoading}
                    className="flex items-center justify-center rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium text-text transition-colors hover:bg-surface-elevated disabled:opacity-50"
                  >
                    <FiArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </button>
                ) : <div />}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center justify-center rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 shadow-md ml-auto"
                  >
                    Next
                    <FiArrowRight className="ml-2 h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || !agreedToTerms || formData.password.length < 8 || formData.password !== confirmPassword}
                    className="flex items-center justify-center rounded-lg bg-primary-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 shadow-md ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiCheck className="mr-2 h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="text-center text-sm text-text-muted pt-2">
                Already have an account?{" "}
                <Link href="/signin" className="font-medium text-primary-500 hover:text-primary-600">Sign In</Link>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Color Picker Modal */}
      {isColorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-surface shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex-none p-6 pb-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-text">Brand Color</h3>
              <button type="button" onClick={closeColorModal} className="rounded-lg p-2 text-text-muted hover:bg-surface-alt hover:text-text transition-colors">
                <FiX size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <ColorPicker color={tempColor} onChange={setTempColor} disabled={false} />
            </div>
            <div className="flex-none p-6 pt-4 border-t border-border bg-surface flex gap-3">
              <button type="button" onClick={closeColorModal} className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 font-medium text-text transition-colors hover:bg-surface-alt">
                Cancel
              </button>
              <button type="button" onClick={applyColor} className="flex-1 rounded-lg bg-primary-500 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-600">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
