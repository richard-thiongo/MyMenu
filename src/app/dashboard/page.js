"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useSWR, { preload } from "swr";
import toast from "react-hot-toast";
import { FiPlus, FiFolder, FiEdit2, FiTrash2 } from "react-icons/fi";
import { api } from "@/lib/api";
import Skeleton from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";
import CategoryModal from "@/components/CategoryModal";
import ConfirmModal from "@/components/ConfirmModal";
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

export default function DashboardCategories() {
  const { data: categories, error, isLoading, mutate } = useSWR("/api/categories", categoriesFetcher, {
    revalidateOnFocus: false,       // don't refetch when tab regains focus
    revalidateOnReconnect: false,   // don't refetch on network reconnect
    dedupingInterval: 30000,        // reuse cached data for 30 seconds
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, id: null, name: "" });
  
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
      mutate(); // Refresh SWR cache
    } catch (err) {
      toast.error(err.message || "Failed to save category");
    }
  };

  const handleDeleteCategory = (id, name, e) => {
    e.preventDefault(); // prevent navigation since card is a Link
    setConfirmState({ isOpen: true, id, name });
  };

  const { showLoading, hideLoading, showError } = useStatus();

  const handleConfirmDelete = async () => {
    setConfirmState({ isOpen: false, id: null, name: "" }); // Close confirm modal first
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

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Menu Categories</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage your menu sections. Click a category to add food items.
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
          description="You haven't added any categories to your menu. Click the Add Category button to get started."
          icon={FiFolder}
        />
      )}

      {/* Modal is mounted conditionally inside the component to destroy state on close, or we can use the key trick. Here we just render it if open */}
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
    </div>
  );
}
