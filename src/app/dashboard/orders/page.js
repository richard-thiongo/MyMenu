"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { FiCheck, FiSave, FiAlertCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function OrdersPage() {
  const [ordersEnabled, setOrdersEnabled] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isToggling, setIsToggling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    api.getProfile().then(res => {
      if (res && res.data) {
        setOrdersEnabled(!!res.data.orders_enabled);
        setWhatsappNumber(res.data.whatsappnumber || "");
      }
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const handleToggleOrders = async () => {
    setIsToggling(true);
    const newState = !ordersEnabled;
    try {
      await api.updateProfile({ orders_enabled: newState });
      setOrdersEnabled(newState);
    } catch (err) {
      console.error("Failed to toggle orders", err);
      alert("Failed to toggle orders: " + err.message);
    } finally {
      setIsToggling(false);
    }
  };

  const handleSaveWhatsapp = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      await api.updateProfile({ whatsappnumber: whatsappNumber });
      setSaveMessage("WhatsApp number saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save WhatsApp number", err);
      alert("Failed to save WhatsApp number: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-text-muted">Loading settings...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Toggle Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-surface-alt rounded-2xl border border-border shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-bold text-text">Accept Orders via WhatsApp</h2>
          <p className="text-sm text-text-muted mt-1">Enable or disable digital ordering for your customers.</p>
        </div>
        <button
          onClick={handleToggleOrders}
          disabled={isToggling}
          className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${ordersEnabled ? 'bg-primary-500' : 'bg-surface-elevated'}`}
        >
          <span className="sr-only">Toggle Orders</span>
          <span
            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${ordersEnabled ? 'translate-x-6' : 'translate-x-0'}`}
          />
        </button>
      </div>

      {ordersEnabled && !whatsappNumber && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-400 flex items-start gap-3">
          <FiAlertCircle size={20} className="mt-0.5 shrink-0" />
          <p className="font-medium text-sm">
            Orders are enabled, but you haven't set a WhatsApp number. Customers won't be able to place orders until you add your number below.
          </p>
        </div>
      )}

      {/* WhatsApp Number Section */}
      <div className="p-6 bg-surface rounded-2xl border border-border shadow-sm">
        <h3 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
          <FaWhatsapp className="text-[#25D366]" size={22} /> WhatsApp Number
        </h3>
        <p className="text-sm text-text-muted mb-4">
          Enter the WhatsApp number where you want to receive customer orders (e.g., 0712345678 or 0123456789).
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="0700000000"
            className="flex-1 rounded-lg border border-border bg-surface-alt p-3 text-text focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button
            onClick={handleSaveWhatsapp}
            disabled={isSaving}
            className="rounded-lg bg-primary-500 px-6 py-3 font-bold text-white shadow-md hover:bg-primary-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isSaving ? "Saving..." : <><FiSave /> Save Number</>}
          </button>
        </div>
        {saveMessage && (
          <p className="mt-3 text-sm font-medium text-green-500 flex items-center gap-1">
            <FiCheck /> {saveMessage}
          </p>
        )}
      </div>
    </div>
  );
}
