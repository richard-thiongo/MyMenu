"use client";

import { useState, useEffect } from "react";
import { FiDroplet, FiSave, FiLoader, FiCheckCircle, FiLock, FiChevronDown, FiChevronUp, FiEye, FiEyeOff } from "react-icons/fi";
import { api } from "@/lib/api";
import useAuthStore from "@/hooks/useAuthStore";
import toast from "react-hot-toast";

import { useStatus } from "@/providers/StatusProvider";
import ColorPicker from "@/components/ColorPicker";

const AccordionItem = ({ id, title, description, icon: Icon, children, expandedSection, setExpandedSection }) => {
  const isExpanded = expandedSection === id;
  return (
    <div className="rounded-2xl border border-border bg-surface-alt shadow-sm transition-all duration-300 relative">
      <button
        type="button"
        onClick={() => setExpandedSection(isExpanded ? null : id)}
        className={`w-full flex items-center justify-between p-6 bg-surface-alt hover:bg-surface-elevated transition-colors text-left rounded-t-2xl ${!isExpanded ? 'rounded-b-2xl' : ''}`}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
            <Icon size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text">{title}</h2>
            <p className="text-sm text-text-muted">{description}</p>
          </div>
        </div>
        <div className="text-text-muted shrink-0 ml-4">
          {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </div>
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border pt-6 rounded-b-2xl relative">
          {children}
        </div>
      )}
    </div>
  );
};

export default function SettingsPage() {
  const { primaryColor, restaurantName, login, token, refreshToken, isPaid, subscriptionExpiresAt } = useAuthStore();
  const [color, setColor] = useState(primaryColor || "#1800ad");
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { showLoading, hideLoading, showError } = useStatus();

  // Sync if store changes (e.g. after first load)
  useEffect(() => {
    if (primaryColor) setColor(primaryColor);
  }, [primaryColor]);

  const handleSave = async (e) => {
    e.preventDefault();
    // Basic hex validation
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
      showError("Please enter a valid 6-digit hex color (e.g. #ff5733).");
      return;
    }
    setIsLoading(true);
    showLoading("Updating settings...");
    try {
      await api.updateProfile({ primary_color: color });
      // Only update primaryColor in the store — do NOT call login() as it would
      // overwrite restaurantName and other fields if arguments are mismatched.
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
    if (newPassword.length < 8) {
      showError("Password must be at least 8 characters.");
      return;
    }
    setIsResetConfirmOpen(true);
  };

  const confirmPasswordReset = async () => {
    setIsResetConfirmOpen(false);
    setIsPasswordLoading(true);
    showLoading("Resetting password...");
    try {
      await api.resetPassword({ restaurant_name: restaurantName, new_password: newPassword });
      
      // Automatically log in with the new password to update authStore token
      const authRes = await api.login({ restaurant_name: restaurantName, password: newPassword });
      login(authRes.data.token, authRes.data.restaurant.restaurant_name, authRes.data.restaurant.primary_color);

      // Update remembered credentials if they exist
      const saved = localStorage.getItem("mymenu-remembered-credentials");
      if (saved) {
        try {
          const creds = JSON.parse(saved);
          if (creds.restaurant_name === restaurantName) {
            localStorage.setItem("mymenu-remembered-credentials", JSON.stringify({
              ...creds,
              password: newPassword
            }));
          }
        } catch (e) {
          // ignore
        }
      }

      toast.success("Password reset successfully!");
      setNewPassword("");
      setExpandedSection(null);
    } catch (err) {
      showError(err.message || "Failed to reset password.");
    } finally {
      setIsPasswordLoading(false);
      hideLoading();
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="mt-1 text-sm text-text-muted">
          Manage your restaurant profile and branding.
        </p>
      </div>

      <div className="space-y-4">
        <AccordionItem
          id="brand-color"
          title="Brand Color"
          description="This color themes your public-facing menu page."
          icon={FiDroplet}
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        >
          {/* Live Preview */}
          <div className="mb-6 flex items-center gap-4 rounded-xl border border-border p-4">
            <div
              className="h-14 w-14 shrink-0 rounded-xl shadow-md"
              style={{ backgroundColor: color }}
            />
            <div>
              <p className="text-sm font-medium text-text">Live Preview</p>
              <p className="text-xs text-text-muted">
                This is how your brand color will look on your menu.
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-text">
                {color}
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-muted">
                Choose Brand Color
              </label>
              <ColorPicker 
                color={color} 
                onChange={setColor} 
                disabled={isLoading} 
              />
            </div>

            <div className="sticky bottom-[72px] md:bottom-0 z-30 flex justify-end p-4 -mx-6 -mb-6 mt-4 border-t border-border bg-surface-alt/95 backdrop-blur-md rounded-b-2xl shadow-[0_-8px_10px_-4px_rgba(0,0,0,0.05)]">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full sm:w-auto justify-center items-center rounded-lg bg-primary-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-600 shadow-md disabled:opacity-70"
              >
                {isLoading ? (
                  <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FiSave className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </AccordionItem>

        <AccordionItem
          id="reset-password"
          title="Reset Password"
          description="Change your account password. Make sure it's at least 8 characters long."
          icon={FiLock}
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        >
          <form onSubmit={initiatePasswordReset} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-muted">
                New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isPasswordLoading}
                  className="block w-full rounded-lg border border-border bg-surface pl-10 pr-10 py-3 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="sticky bottom-[72px] md:bottom-0 z-30 flex justify-end p-4 -mx-6 -mb-6 mt-4 border-t border-border bg-surface-alt/95 backdrop-blur-md rounded-b-2xl shadow-[0_-8px_10px_-4px_rgba(0,0,0,0.05)]">
              <button
                type="submit"
                disabled={isPasswordLoading || newPassword.length < 8}
                className="flex w-full sm:w-auto justify-center items-center rounded-lg bg-red-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600 shadow-md disabled:opacity-70"
              >
                {isPasswordLoading ? (
                  <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FiSave className="mr-2 h-4 w-4" />
                )}
                Reset Password
              </button>
            </div>
          </form>
        </AccordionItem>
      </div>

      {/* Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-text mb-2">Confirm Reset</h3>
            <p className="text-sm text-text-muted mb-6">
              Are you sure you want to change your password? This will overwrite your current password.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 font-medium text-text transition-colors hover:bg-surface-alt"
              >
                Cancel
              </button>
              <button
                onClick={confirmPasswordReset}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600 shadow-sm"
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
