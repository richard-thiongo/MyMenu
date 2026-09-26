"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useSWR, { preload } from "swr";
import toast from "react-hot-toast";
import { FiPlus, FiFolder, FiEdit2, FiTrash2, FiCopy, FiCheck, FiDownload, FiX } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";
import { QRCodeCanvas } from "qrcode.react";
import { api } from "@/lib/api";
import useAuthStore from "@/hooks/useAuthStore";
import Skeleton from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";
import CategoryModal from "@/components/CategoryModal";
import ConfirmModal from "@/components/ConfirmModal";
import MenuSetupGuide from "@/components/MenuSetupGuide";
import { useStatus } from "@/providers/StatusProvider";

// SWR fetcher
const categoriesFetcher = async () => {
  const res = await api.getCategories();
  return res.data || [];
};

const foodItemsFetcher = async () => {
  const res = await api.getFoodItems();
  return res.data || [];
};

// Preload food items immediately so navigating into a category is instant
preload("/api/food-items", foodItemsFetcher);

// --- QR Code Modal ---
function QrModal({ restaurantName, username, onClose }) {
  const [url, setUrl] = useState("");
  const qrRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && username) {
      setUrl(`${window.location.origin}/${encodeURIComponent(username)}`);
    }
  }, [username]);

  const handleDownload = () => {
    if (!qrRef.current) return;
    const qrCanvas = qrRef.current.querySelector("canvas");
    if (!qrCanvas) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const padding = 20;
    const textSpace = 50; 
    canvas.width = qrCanvas.width + padding * 2;
    canvas.height = qrCanvas.height + padding * 2 + textSpace;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(qrCanvas, padding, padding);

    const displayUrl = url.replace(/^https?:\/\//, '');

    ctx.textAlign = "center";

    // Draw URL
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#555555";
    ctx.textBaseline = "top";
    ctx.fillText(displayUrl, canvas.width / 2, padding + qrCanvas.height + 10);

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${restaurantName}_Menu_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <LuQrCode className="text-primary-500" />
            Your QR Code
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-text-muted transition-colors hover:bg-surface-elevated hover:text-text"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl mb-4">
          <div ref={qrRef}>
            {url ? (
              <QRCodeCanvas value={url} size={200} level="H" includeMargin={true} />
            ) : (
              <div className="h-[200px] w-[200px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400 text-sm">
                Loading...
              </div>
            )}
          </div>
          {url && (
            <div className="mt-2 text-center text-[16px] font-medium text-[#555555] break-all max-w-[240px]">
              {url.replace(/^https?:\/\//, '')}
            </div>
          )}
        </div>

        <button
          onClick={handleDownload}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors shadow-md"
        >
          <FiDownload size={16} />
          Download QR Code
        </button>
      </div>
    </div>
  );
}

export default function DashboardCategories() {
  const { restaurantName, username } = useAuthStore();
  const { data: categories, error, isLoading, mutate } = useSWR("/api/categories", categoriesFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 30000,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, id: null, name: "" });
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [guideComplete, setGuideComplete] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("menu_guide_complete") === "true";
    }
    return false;
  });

  const handleCompleteGuide = () => {
    localStorage.setItem("menu_guide_complete", "true");
    setGuideComplete(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && username) {
      setUrl(`${window.location.origin}/${encodeURIComponent(username)}`);
    }
  }, [username]);

  const handleCopy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCategory(null);
    setIsModalOpen(false);
  };

  const handleSaveCategory = async (data) => {
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.category_id, data);
        toast.success("Category updated!");
      } else {
        await api.createCategory(data);
        toast.success("Category created!");
      }
      handleCloseModal();
      mutate();
    } catch (err) {
      toast.error(err.message || "Failed to save category");
    }
  };

  const handleDeleteCategory = (id, name, e) => {
    e.preventDefault();
    setConfirmState({ isOpen: true, id, name });
  };

  const { showLoading, hideLoading, showError } = useStatus();

  const handleConfirmDelete = async () => {
    setConfirmState({ isOpen: false, id: null, name: "" });
    showLoading("Deleting category...");
    try {
      await api.deleteCategory(confirmState.id);
      toast.success("Category deleted!");
      mutate();
    } catch (err) {
      showError(err.message || "Failed to delete category");
    } finally {
      hideLoading();
    }
  };

  // Guide is now shown on-demand in a modal, not taking over the whole screen

  return (
    <div className="mx-auto max-w-6xl">

      {/* Share section */}
      <div className="mb-6">
        <p className="text-sm font-medium text-text-muted mb-2">Here is the link to share your menu:</p>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 truncate rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-primary-500 hover:underline focus:outline-none"
          >
            {url.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
          <button
            onClick={handleCopy}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors shadow-sm"
            title="Copy link"
          >
            {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
          </button>
        </div>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-text-muted">And also your QR code is here:</p>
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
            title="See QR Code"
          >
            <LuQrCode size={20} className="text-white" />
            <span>See QR</span>
          </button>
        </div>
      </div>

      {/* Categories header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text">Menu Categories</h2>
          <p className="mt-1 text-sm text-text-muted">
            Click a category to add food items.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600 active:scale-95"
        >
          <FiPlus className="mr-2 h-5 w-5" />
          Add a Category
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Failed to load"
          description={error.message || "Could not fetch categories"}
        />
      ) : categories && categories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.category_id}
              prefetch={true}
              href={`/dashboard/categories/${encodeURIComponent(cat.category_name)}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface-alt p-6 transition-all hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10"
            >
              {cat.image_url && (
                <img
                  src={cat.image_url}
                  alt={cat.category_name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-10 transition-opacity group-hover:opacity-20"
                />
              )}
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-primary-500/10 text-primary-500">
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.category_name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <FiFolder size={24} />
                  )}
                </div>
                <div className="flex items-center gap-2 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenModal(cat);
                    }}
                    className="rounded-md p-2 text-text-muted hover:bg-surface-elevated hover:text-primary-500"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteCategory(cat.category_id, cat.category_name, e)}
                    className="rounded-md p-2 text-text-muted hover:bg-surface-elevated hover:text-red-500"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-text group-hover:text-primary-500 transition-colors">
                {cat.category_name}
              </h3>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Categories Yet"
          description="Click the Add a Category button above to create your first menu section."
          icon={FiFolder}
        />
      )}

      {isModalOpen && (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSaveCategory}
          initialData={editingCategory}
        />
      )}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, id: null, name: "" })}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${confirmState.name}"? This cannot be undone.`}
      />

      {isQrOpen && (
        <QrModal restaurantName={restaurantName} username={username} onClose={() => setIsQrOpen(false)} />
      )}
    </div>
  );
}
