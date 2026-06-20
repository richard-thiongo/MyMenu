"use client";

import { useState } from "react";
import { FiCreditCard, FiCheckCircle, FiLoader } from "react-icons/fi";
import { api } from "@/lib/api";
import { useStatus } from "@/providers/StatusProvider";
import useAuthStore from "@/hooks/useAuthStore";
import toast from "react-hot-toast";

export default function PaymentsPage() {
  const { isPaid, subscriptionExpiresAt } = useAuthStore();
  const [paymentMessage, setPaymentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showLoading, hideLoading, showError } = useStatus();

  const isSubscriptionActive = isPaid && (!subscriptionExpiresAt || new Date(subscriptionExpiresAt) > new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMessage.trim()) {
      showError("Please enter your payment message or transaction code.");
      return;
    }

    setIsLoading(true);
    showLoading("Submitting payment verification...");
    
    try {
      await api.submitPayment({ paymentMessage });
      setIsSubmitted(true);
      setPaymentMessage("");
      toast.success("Payment submitted for review!");
    } catch (error) {
      showError(error.message || "Failed to submit payment. Please try again.");
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface-alt p-6">
        <h2 className="text-xl font-bold text-text mb-4">Subscription Status</h2>
        {isSubscriptionActive ? (
          <div className="flex items-center gap-3 text-green-600 dark:text-green-500 bg-green-500/10 p-4 rounded-lg">
            <FiCheckCircle className="h-6 w-6" />
            <div>
              <p className="font-medium">Your subscription is active</p>
              {subscriptionExpiresAt && (
                <p className="text-sm opacity-80">Valid until {new Date(subscriptionExpiresAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500 bg-amber-500/10 p-4 rounded-lg mb-6">
            <FiCreditCard className="h-6 w-6" />
            <div>
              <p className="font-medium">Your subscription is inactive or expired</p>
              <p className="text-sm opacity-80">Your public menu is currently hidden. Please submit a payment to reactivate.</p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h3 className="text-lg font-bold text-text mb-2">Submit Payment Details</h3>
        <p className="text-sm text-text-muted mb-6">
          Paste the full payment confirmation message (e.g. M-Pesa SMS) or transaction code below so the admin can verify your payment and activate your 31-day subscription.
        </p>

        {isSubmitted ? (
          <div className="text-center p-6 border border-dashed border-primary-500/50 rounded-lg bg-primary-500/5">
            <FiCheckCircle className="mx-auto h-10 w-10 text-primary-500 mb-3" />
            <h4 className="text-lg font-medium text-text">Submission Received</h4>
            <p className="text-sm text-text-muted mt-1">We have sent your details to the admin. Your subscription will be activated shortly upon verification.</p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="mt-4 text-primary-500 text-sm hover:underline"
            >
              Submit another code
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2" htmlFor="paymentMessage">
                Transaction Code / Payment Message
              </label>
              <textarea
                id="paymentMessage"
                rows={5}
                className="w-full rounded-lg border border-border bg-surface p-4 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-y"
                placeholder="Paste the SMS or transaction code here..."
                value={paymentMessage}
                onChange={(e) => setPaymentMessage(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !paymentMessage.trim()}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin h-4 w-4" />
                  Submitting...
                </>
              ) : (
                "Submit Payment Verification"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
