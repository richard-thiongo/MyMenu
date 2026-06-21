"use client";

import { FiX } from "react-icons/fi";
import { useEffect } from "react";

export default function PublicItemModal({ isOpen, item, onClose }) {
  // Prevent scrolling on the background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70"
        >
          <FiX size={18} />
        </button>

        {/* Optional Header Image */}
        {item.img_url && (
          <div className="h-56 w-full bg-surface-elevated">
            <img
              src={item.img_url}
              alt={item.food_name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold text-text">{item.food_name}</h2>
          </div>
          {item.price != null && (
            <p className="mt-2 text-xl font-bold text-primary-500">
              KES {parseFloat(item.price).toFixed(2)}
            </p>
          )}

          {item.description && (
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-base leading-relaxed text-text">
                {item.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
