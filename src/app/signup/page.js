"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiLock, FiUser, FiMapPin, FiLoader, FiEye, FiEyeOff, FiDroplet, FiX, FiMail, FiArrowRight, FiArrowLeft, FiCheck } from "react-icons/fi";
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

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    restaurant_name: "",
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

  const handleNextStep = () => {
    if (currentStep === 1 && !formData.restaurant_name) {
      showError("Please enter your restaurant name.");
      return;
    }
    if (currentStep === 2 && !formData.location) {
      showError("Please enter your location.");
      return;
    }
    // Step 3 (Color) always has a default value
    if (currentStep === 4 && !formData.restaurant_email) {
      showError("Please enter your email address.");
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== totalSteps) {
      handleNextStep();
      return;
    }

    if (formData.password.length < 8) {
      showError("Password must be at least 8 characters.");
      return;
    }
    if (formData.password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }
    if (!agreedToTerms) {
      showError("You must agree to the terms to create an account.");
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

  // Calculate progress percentage
  const progressPercent = ((currentStep) / totalSteps) * 100;

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
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface-alt shadow-xl overflow-hidden">
          
          {/* Progress Bar */}
          <div className="h-2 w-full bg-surface">
            <div 
              className="h-full bg-primary-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="p-8">
            <div className="mb-8">
              <div className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2">
                Step {currentStep} of {totalSteps}
              </div>
              <h2 className="text-3xl font-extrabold text-text">
                {currentStep === 1 && "Restaurant Identity"}
                {currentStep === 2 && "Location & Presence"}
                {currentStep === 3 && "Brand Aesthetics"}
                {currentStep === 4 && "Contact Information"}
                {currentStep === 5 && "Account Security"}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: RESTAURANT NAME */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <p className="text-sm text-text-muted bg-surface p-4 rounded-lg border border-border/50">
                    This is how customers will recognize you. It will be prominently displayed at the top of your digital menu.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="restaurant_name">
                      Restaurant Name
                    </label>
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
                        placeholder="e.g. Pasta Palace"
                        value={formData.restaurant_name}
                        onChange={(e) => setFormData({ ...formData, restaurant_name: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: LOCATION */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <p className="text-sm text-text-muted bg-surface p-4 rounded-lg border border-border/50">
                    Adding your city or neighborhood helps customers verify they are looking at the correct menu for your specific branch.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="location">
                      Location
                    </label>
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
                </div>
              )}

              {/* STEP 3: BRAND COLOR */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <p className="text-sm text-text-muted bg-surface p-4 rounded-lg border border-border/50">
                    Make your menu uniquely yours! This color will theme your digital menu to perfectly match your brand's physical aesthetic.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">
                      Primary Brand Color
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
                  </div>
                </div>
              )}

              {/* STEP 4: EMAIL */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <p className="text-sm text-text-muted bg-surface p-4 rounded-lg border border-border/50">
                    We'll use this to send you important account updates and securely reset your password if you ever forget it.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="restaurant_email">
                      Email Address
                    </label>
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
                        placeholder="e.g. hello@pastapalace.com"
                        value={formData.restaurant_email}
                        onChange={(e) => setFormData({ ...formData, restaurant_email: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: PASSWORD & TERMS */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <p className="text-sm text-text-muted bg-surface p-4 rounded-lg border border-border/50">
                    Create a strong password to protect your restaurant's digital menu and dashboard from unauthorized access.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="password">
                        Password
                      </label>
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

                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="confirmPassword">
                        Confirm Password
                      </label>
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
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms Consent */}
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
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
                </div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="pt-6 mt-6 border-t border-border flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isLoading}
                    className="flex items-center justify-center rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium text-text transition-colors hover:bg-surface-elevated disabled:opacity-50"
                  >
                    <FiArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </button>
                ) : (
                  <div /> /* Spacer */
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center justify-center rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 shadow-md ml-auto"
                  >
                    Next Step
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
                        Complete Sign Up
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <div className="text-center text-sm text-text-muted pt-4">
                Already have an account?{" "}
                <Link href="/signin" className="font-medium text-primary-500 hover:text-primary-600">
                  Sign In
                </Link>
              </div>

            </form>
          </div>
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
