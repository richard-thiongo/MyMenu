"use client";

import { useState, useEffect } from "react";
import { FiDroplet, FiSave, FiLoader, FiCheckCircle, FiLock, FiAlertCircle, FiCreditCard, FiCopy, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { api } from "@/lib/api";
import useAuthStore from "@/hooks/useAuthStore";
import toast from "react-hot-toast";
import { useStatus } from "@/providers/StatusProvider";
import ColorPicker from "@/components/ColorPicker";

// --- Modal wrapper with sticky header + footer ---
const SettingsModal = ({ title, accentColor, onClose, footer, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    {/* Panel — flex column so header/footer stick */}
    <div className="relative w-full max-w-lg max-h-[90vh] rounded-3xl bg-surface shadow-2xl border border-border flex flex-col overflow-hidden">

      {/* Sticky Header */}
      <div
        className="flex shrink-0 items-center justify-between px-6 py-4"
        style={{ backgroundColor: accentColor }}
      >
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
          aria-label="Close"
        >
          <FiX size={18} color="white" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

      {/* Sticky Footer */}
      {footer && (
        <div className="shrink-0 border-t border-border bg-surface px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  </div>
);

// --- Setting Card Button (dark opacity tiles) ---
const SettingCard = ({ id, label, subtitle, icon: Icon, accentColor, onClick }) => (
  <button
    type="button"
    id={`settings-card-${id}`}
    onClick={onClick}
    className="group relative flex flex-col items-start gap-3 rounded-2xl p-5 text-left shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.97] overflow-hidden"
    style={{ backgroundColor: accentColor }}
  >
    {/* Dark opacity overlay */}
    <div
      className="absolute inset-0 rounded-2xl"
      style={{ backgroundColor: "rgba(0,0,0,0.28)" }}
    />
    {/* Subtle corner glow */}
    <div
      className="absolute -top-6 -right-6 h-20 w-20 rounded-full"
      style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
    />

    <div className="relative z-10 flex w-full items-center justify-between">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
      >
        <Icon size={20} color="white" />
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-base font-bold text-white">{label}</p>
      <p className="text-xs text-white/60 mt-0.5">{subtitle}</p>
    </div>
  </button>
);

export default function SettingsPage() {
  const { primaryColor, isPaid, subscriptionExpiresAt } = useAuthStore();
  const [color, setColor] = useState(primaryColor || "#1800ad");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const { showLoading, hideLoading, showError } = useStatus();

  const [ordersEnabled, setOrdersEnabled] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isToggling, setIsToggling] = useState(false);
  const [isSavingWhatsapp, setIsSavingWhatsapp] = useState(false);

  const [paymentMessage, setPaymentMessage] = useState("");
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isPaymentSubmitted, setIsPaymentSubmitted] = useState(false);
  const isSubscriptionActive = isPaid && (!subscriptionExpiresAt || new Date(subscriptionExpiresAt) > new Date());

  useEffect(() => {
    if (primaryColor) setColor(primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    api.getProfile().then(res => {
      if (res && res.data) {
        setOrdersEnabled(!!res.data.orders_enabled);
        setWhatsappNumber(res.data.whatsappnumber || "");
      }
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setActiveModal(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleToggleOrders = async () => {
    setIsToggling(true);
    const newState = !ordersEnabled;
    try {
      await api.updateProfile({ orders_enabled: newState });
      setOrdersEnabled(newState);
      toast.success(newState ? "WhatsApp orders enabled!" : "WhatsApp orders disabled.");
    } catch (err) {
      showError(err.message || "Failed to toggle orders.");
    } finally {
      setIsToggling(false);
    }
  };

  const handleSaveWhatsapp = async () => {
    setIsSavingWhatsapp(true);
    try {
      await api.updateProfile({ whatsappnumber: whatsappNumber });
      toast.success("WhatsApp number saved successfully!");
    } catch (err) {
      showError(err.message || "Failed to save WhatsApp number.");
    } finally {
      setIsSavingWhatsapp(false);
    }
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handlePaymentSubmit = async () => {
    if (!paymentMessage.trim()) {
      showError("Please enter your payment message or transaction code.");
      return;
    }
    setIsPaymentLoading(true);
    showLoading("Submitting payment verification...");
    try {
      const response = await api.submitPayment({ paymentMessage });
      if (response?.data) {
        useAuthStore.getState().login(
          useAuthStore.getState().token,
          useAuthStore.getState().refreshToken,
          response.data.restaurant_name,
          response.data.primary_color,
          response.data.is_paid,
          response.data.subscription_expires_at
        );
      }
      setIsPaymentSubmitted(true);
      setPaymentMessage("");
      toast.success("Payment submitted successfully!");
    } catch (error) {
      showError(error.message || "Failed to submit payment. Please try again.");
    } finally {
      setIsPaymentLoading(false);
      hideLoading();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    showLoading("Updating settings...");
    try {
      await api.updateProfile({ primary_color: color });
      useAuthStore.setState({ primaryColor: color });
      toast.success("Brand color updated!");
    } catch (err) {
      showError(err.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  const initiatePasswordReset = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      showError("Please enter your email address.");
      return;
    }
    setIsResetConfirmOpen(true);
  };

  const confirmPasswordReset = async () => {
    setIsResetConfirmOpen(false);
    setIsPasswordLoading(true);
    showLoading("Sending reset link...");
    try {
      await api.forgotPassword(resetEmail);
      toast.success("Reset link sent! Please check your email inbox.");
      setResetEmail("");
    } catch (err) {
      showError(err.message || "Failed to send reset link.");
    } finally {
      setIsPasswordLoading(false);
      hideLoading();
    }
  };

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="mt-1 text-sm text-text-muted">Manage your restaurant profile and branding.</p>
      </div>

      {/* Always 2 per row */}
      <div className="grid grid-cols-2 gap-4">
        <SettingCard
          id="brand-color"
          label="Brand Color"
          subtitle="Theme your menu"
          icon={FiDroplet}
          accentColor={color}
          onClick={() => setActiveModal("brand-color")}
        />
        <SettingCard
          id="whatsapp-ordering"
          label="WhatsApp Orders"
          subtitle="Receive orders on phone"
          icon={FaWhatsapp}
          accentColor="#25D366"
          onClick={() => setActiveModal("whatsapp-ordering")}
        />
        <SettingCard
          id="reset-password"
          label="Reset Password"
          subtitle="Change your credentials"
          icon={FiLock}
          accentColor="#ef4444"
          onClick={() => setActiveModal("reset-password")}
        />
        <SettingCard
          id="subscription-billing"
          label="Billing"
          subtitle={isSubscriptionActive ? "Active" : "Inactive"}
          icon={FiCreditCard}
          accentColor="#3b82f6"
          onClick={() => setActiveModal("subscription-billing")}
        />
      </div>

      {/* ===== MODALS ===== */}

      {/* Brand Color Modal */}
      {activeModal === "brand-color" && (
        <SettingsModal
          title="Brand Color"
          accentColor={color}
          onClose={() => setActiveModal(null)}
          footer={
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="flex w-full justify-center items-center rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 shadow-md disabled:opacity-70"
            >
              {isLoading ? <FiLoader className="mr-2 h-4 w-4 animate-spin" /> : <FiSave className="mr-2 h-4 w-4" />}
              Save Changes
            </button>
          }
        >
          <div className="mb-5 flex items-center gap-4 rounded-xl border border-border bg-surface-alt p-4">
            <div className="h-12 w-12 shrink-0 rounded-xl shadow-md border border-border" style={{ backgroundColor: color }} />
            <div>
              <p className="text-sm font-medium text-text">Live Preview</p>
              <p className="text-xs text-text-muted">This is how your brand color looks on your menu.</p>
              <p className="mt-1 font-mono text-sm font-semibold text-text">{color}</p>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text-muted">Choose Brand Color</label>
            <ColorPicker color={color} onChange={setColor} disabled={isLoading} />
          </div>
        </SettingsModal>
      )}

      {/* WhatsApp Ordering Modal */}
      {activeModal === "whatsapp-ordering" && (
        <SettingsModal
          title="WhatsApp Ordering"
          accentColor="#25D366"
          onClose={() => setActiveModal(null)}
          footer={
            <button
              type="button"
              onClick={handleSaveWhatsapp}
              disabled={isSavingWhatsapp}
              className="flex w-full justify-center items-center rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white shadow-md hover:bg-[#1fa855] disabled:opacity-50 transition-colors gap-2"
            >
              {isSavingWhatsapp ? <FiLoader className="animate-spin h-4 w-4" /> : <FiSave className="h-4 w-4" />}
              Save WhatsApp Number
            </button>
          }
        >
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-alt rounded-xl border border-border gap-4">
              <div>
                <h3 className="font-bold text-text">Accept Orders</h3>
                <p className="text-sm text-text-muted mt-0.5">Enable or disable digital ordering.</p>
              </div>
              <button
                type="button"
                onClick={handleToggleOrders}
                disabled={isToggling}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${ordersEnabled ? "bg-[#25D366]" : "bg-surface-elevated"}`}
              >
                <span className="sr-only">Toggle Orders</span>
                <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${ordersEnabled ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>

            {ordersEnabled && !whatsappNumber && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-400 flex items-start gap-3">
                <FiAlertCircle size={18} className="mt-0.5 shrink-0" />
                <p className="text-sm font-medium">Orders are enabled but you haven't set a WhatsApp number yet.</p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-text-muted">WhatsApp Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. 0700000000"
                className="w-full rounded-xl border border-border bg-surface-alt p-3 text-text focus:border-[#25D366] focus:outline-none focus:ring-1 focus:ring-[#25D366]"
              />
              <p className="text-xs text-text-muted mt-2">Enter the number where customers will send orders.</p>
            </div>
          </div>
        </SettingsModal>
      )}

      {/* Reset Password Modal */}
      {activeModal === "reset-password" && (
        <SettingsModal
          title="Reset Password"
          accentColor="#ef4444"
          onClose={() => setActiveModal(null)}
          footer={
            <button
              type="button"
              onClick={initiatePasswordReset}
              disabled={isPasswordLoading || !resetEmail}
              className="flex w-full justify-center items-center rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600 shadow-md disabled:opacity-70 gap-2"
            >
              {isPasswordLoading ? <FiLoader className="animate-spin h-4 w-4" /> : <FiSave className="h-4 w-4" />}
              Send Reset Link
            </button>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-text-muted">Enter your email address and we'll send you a link to reset your password.</p>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-muted">Email Address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  disabled={isPasswordLoading}
                  className="block w-full rounded-xl border border-border bg-surface-alt pl-10 pr-4 py-3 text-text placeholder-text-muted focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="e.g. hello@restaurant.com"
                />
              </div>
            </div>
          </div>
        </SettingsModal>
      )}

      {/* Billing Modal */}
      {activeModal === "subscription-billing" && (
        <SettingsModal
          title="Subscription & Billing"
          accentColor="#3b82f6"
          onClose={() => setActiveModal(null)}
          footer={
            !isSubscriptionActive && !isPaymentSubmitted ? (
              <button
                type="button"
                onClick={handlePaymentSubmit}
                disabled={isPaymentLoading || !paymentMessage.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50 shadow-md"
              >
                {isPaymentLoading ? <><FiLoader className="animate-spin h-4 w-4" /> Submitting...</> : "Submit Payment Verification"}
              </button>
            ) : null
          }
        >
          <div className="space-y-5">
            {/* Status */}
            {isSubscriptionActive ? (
              <div className="flex items-center gap-3 text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                <FiCheckCircle className="h-6 w-6 shrink-0" />
                <div>
                  <p className="font-semibold">Subscription is active</p>
                  {subscriptionExpiresAt && (
                    <p className="text-sm opacity-80">Valid until {new Date(subscriptionExpiresAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                <FiCreditCard className="h-6 w-6 shrink-0" />
                <div>
                  <p className="font-semibold">Subscription inactive or expired</p>
                  <p className="text-sm opacity-80">Your menu is hidden. Submit a payment below to reactivate.</p>
                </div>
              </div>
            )}

            {/* How to Pay */}
            <div>
              <p className="text-sm font-semibold text-text mb-3">
                How to Pay — <span className="text-blue-500 font-bold">Ksh 1,999/month</span>
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-surface-alt p-4">
                  <h4 className="mb-2 font-semibold text-text text-sm">Pochi La Biashara</h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-text-muted">
                    <li>Go to M-PESA and select <strong>Pochi La Biashara</strong></li>
                    <li className="flex items-center flex-wrap gap-1">
                      Send to:
                      <button onClick={() => handleCopy("0704286209", "Phone number")} type="button"
                        className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors">
                        0704286209 <FiCopy className="h-3 w-3" />
                      </button>
                    </li>
                    <li>Enter amount and complete</li>
                    <li>Paste the M-PESA transaction message below</li>
                  </ol>
                </div>
                <div className="rounded-xl border border-border bg-surface-alt p-4">
                  <h4 className="mb-2 font-semibold text-text text-sm">Paybill</h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-text-muted">
                    <li>M-PESA &gt; Lipa na M-PESA &gt; <strong>Pay Bill</strong></li>
                    <li className="flex items-center flex-wrap gap-1">
                      Business:
                      <button onClick={() => handleCopy("303030", "Business number")} type="button"
                        className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors">
                        303030 <FiCopy className="h-3 w-3" />
                      </button>
                    </li>
                    <li className="flex items-center flex-wrap gap-1">
                      Account:
                      <button onClick={() => handleCopy("2056697449", "Account number")} type="button"
                        className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors">
                        2056697449 <FiCopy className="h-3 w-3" />
                      </button>
                    </li>
                    <li>Enter amount and complete</li>
                    <li>Paste the M-PESA transaction message below</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Verify Payment */}
            {!isSubscriptionActive && (
              <div>
                <h3 className="mb-3 font-bold text-text">Verify Payment</h3>
                {isPaymentSubmitted ? (
                  <div className="text-center p-6 border border-dashed border-blue-500/50 rounded-xl bg-blue-500/5">
                    <FiCheckCircle className="mx-auto h-10 w-10 text-blue-500 mb-3" />
                    <h4 className="text-base font-semibold text-text">Submission Received</h4>
                    <p className="text-sm text-text-muted mt-1">Your subscription will be activated shortly upon verification.</p>
                    <button type="button" onClick={() => setIsPaymentSubmitted(false)} className="mt-4 text-blue-500 text-sm hover:underline">
                      Submit another code
                    </button>
                  </div>
                ) : (
                  <textarea
                    id="paymentMessage"
                    rows={4}
                    className="w-full rounded-xl border-2 border-blue-500/30 bg-surface-alt p-4 text-text placeholder-text-muted focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-y"
                    placeholder="Paste your M-PESA SMS or transaction code here..."
                    value={paymentMessage}
                    onChange={(e) => setPaymentMessage(e.target.value)}
                    disabled={isPaymentLoading}
                  />
                )}
              </div>
            )}
          </div>
        </SettingsModal>
      )}

      {/* Password Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl border border-border">
            <h3 className="text-xl font-bold text-text mb-2">Send Reset Link?</h3>
            <p className="text-sm text-text-muted mb-6">
              Are you sure you want to send a password reset link to <span className="font-medium text-text">{resetEmail}</span>?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 rounded-xl border border-border bg-surface-alt px-4 py-2 font-medium text-text transition-colors hover:bg-surface-elevated"
              >
                Cancel
              </button>
              <button
                onClick={confirmPasswordReset}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600 shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
