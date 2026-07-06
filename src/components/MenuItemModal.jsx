"use client";

import { useState } from "react";
import { FiX, FiLoader, FiUploadCloud, FiImage } from "react-icons/fi";
import { api } from "@/lib/api";
import { useStatus } from "@/providers/StatusProvider";

export default function MenuItemModal({ isOpen, onClose, onSubmit, initialData = null, defaultCategory = "" }) {
  const [formData, setFormData] = useState({
    food_name: initialData?.food_name || "",
    price: initialData?.price || "",
    description: initialData?.description || "",
    img_url: initialData?.img_url || "",
    category_name: initialData?.category_name || defaultCategory,
    is_available: initialData?.is_available !== undefined ? initialData.is_available : true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showLoading, hideLoading, showError } = useStatus();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    showLoading(initialData ? "Updating item..." : "Adding item...");
    try {
      let finalImageUrl = formData.img_url;
      if (imageFile) {
        const uploadRes = await api.uploadImage(imageFile);
        finalImageUrl = uploadRes.data.url;
      }
      await onSubmit({
        ...formData,
        img_url: finalImageUrl,
        price: formData.price !== "" ? parseFloat(formData.price) : null,
      });
    } catch (error) {
      showError(error.message || "Oops! Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all overflow-y-auto">
      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-200 rounded-2xl border border-border bg-surface-elevated p-6 shadow-2xl my-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-text">
            {initialData ? "Edit Food Item" : "New Food Item"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="food_name" className="mb-1 block text-sm font-medium text-text-muted">
              Item Name
            </label>
            <input
              id="food_name"
              type="text"
              required
              className="block w-full rounded-lg border border-border bg-surface px-4 py-2 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="e.g., Spicy Tuna Roll"
              value={formData.food_name}
              onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium text-text-muted">
              Price <span className="text-xs text-text-muted font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-xs font-semibold text-text-muted">KES</span>
              </div>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                className="block w-full rounded-lg border border-border bg-surface pl-10 pr-4 py-2 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Leave blank if no price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-text-muted">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={3}
              className="block w-full rounded-lg border border-border bg-surface px-4 py-2 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Describe the dish..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-muted">
              Item Image (Optional)
            </label>
            <label
              htmlFor="foodImageUpload"
              className="group relative flex h-32 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-surface-alt transition-colors hover:border-primary-500 hover:bg-surface-elevated"
            >
              {imageFile || formData.img_url ? (
                <>
                  <img 
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.img_url} 
                    alt="Preview" 
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity hover:bg-black/60">
                    <div className="flex flex-col items-center text-white text-center px-4">
                      <FiUploadCloud className="mb-2 h-6 w-6" />
                      <span className="text-sm font-medium">Click to upload or change photo</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center p-4">
                  <FiUploadCloud className="mb-2 h-8 w-8 text-text-muted group-hover:text-primary-500 transition-colors" />
                  <span className="text-sm font-medium text-text group-hover:text-primary-500 transition-colors">
                    Click to upload image
                  </span>
                  <p className="mt-1 text-xs text-text-muted">Max size: 5MB. Formats: JPG, PNG, WEBP.</p>
                </div>
              )}

              <input
                type="file"
                id="foodImageUpload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                disabled={isLoading}
              />
            </label>
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-alt px-4 py-3">
            <div>
              <p className="text-sm font-medium text-text">Visible on Public Menu</p>
              <p className="text-xs text-text-muted mt-0.5">When off, customers cannot see this item</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData(f => ({ ...f, is_available: !f.is_available }))}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none ${
                formData.is_available ? 'bg-primary-500' : 'bg-surface-alt border-2 border-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-1 ring-black/5 transition-transform ${
                  formData.is_available ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-alt"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.food_name}
              className="flex items-center rounded-lg bg-primary-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-70"
            >
              {isLoading ? (
                <FiLoader className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {initialData ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
