"use client";

import { FiAlertTriangle, FiLoader, FiX } from "react-icons/fi";
import { useState } from "react";

/**
 * A reusable confirmation modal.
 *
 * Props:
 *   isOpen       - boolean, controls visibility
 *   onClose      - fn, called when user cancels
 *   onConfirm    - async fn, called when user confirms
 *   title        - string, dialog heading (default: "Are you sure?")
 *   description  - string, body text
 *   confirmLabel - string, confirm button label (default: "Delete")
 *   danger       - boolean, use red confirm button (default: true)
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  danger = true,
}) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-in fade-in zoom-in duration-200 rounded-2xl border border-border bg-surface-elevated p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${danger ? "bg-red-500/10 text-red-500" : "bg-primary-500/10 text-primary-500"}`}>
              <FiAlertTriangle size={20} />
            </div>
            <h3 className="text-lg font-bold text-text">{title}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full p-1.5 text-text-muted transition-colors hover:bg-surface-alt hover:text-text disabled:opacity-50"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <p className="mb-6 pl-[52px] text-sm text-text-muted">{description}</p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-alt disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex items-center rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors disabled:opacity-70 ${danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary-500 hover:bg-primary-600"
              }`}
          >
            {isLoading && <FiLoader className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
