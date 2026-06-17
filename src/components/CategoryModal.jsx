"use client";

import { useState } from "react";
import { FiX, FiLoader, FiUploadCloud, FiImage } from "react-icons/fi";
import { api } from "@/lib/api";
import { useStatus } from "@/providers/StatusProvider";

export default function CategoryModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [name, setName] = useState(initialData?.category_name || "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showLoading, hideLoading, showError } = useStatus();

  // Reset state when opening with different data
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    showLoading(initialData ? "Updating category..." : "Adding category...");
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        const uploadRes = await api.uploadImage(imageFile);
        finalImageUrl = uploadRes.data.url;
      }
      await onSubmit({ category_name: name, image_url: finalImageUrl });
    } catch (error) {
      showError(error.message || "Oops! Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-200 rounded-2xl border border-border bg-surface-elevated p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-text">
            {initialData ? "Edit Category" : "New Category"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-text-muted">
              Category Name
            </label>
            <input
              id="name"
              type="text"
              required
              autoFocus
              className="block w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="e.g., Starters, Main Course, Drinks"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-muted">
              Category Image (Optional)
            </label>
            <label
              htmlFor="imageUpload"
              className="group relative flex h-32 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-surface-alt transition-colors hover:border-primary-500 hover:bg-surface-elevated"
            >
              {imageFile || imageUrl ? (
                <>
                  <img 
                    src={imageFile ? URL.createObjectURL(imageFile) : imageUrl} 
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
                id="imageUpload"
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

          <div className="flex justify-end gap-3">
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
              disabled={isLoading || !name.trim()}
              className="flex items-center rounded-lg bg-primary-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-70"
            >
              {isLoading ? (
                <FiLoader className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {initialData ? "Save Changes" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
