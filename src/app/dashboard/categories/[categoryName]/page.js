"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import toast from "react-hot-toast";
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiImage, FiGrid } from "react-icons/fi";
import { api } from "@/lib/api";
import Skeleton from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";
import MenuItemModal from "@/components/MenuItemModal";
import ConfirmModal from "@/components/ConfirmModal";
import { useStatus } from "@/providers/StatusProvider";

const fetcher = async () => {
  const res = await api.getFoodItems();
  return res.data || [];
};

export default function CategoryDrillDown() {
  const params = useParams();
  const router = useRouter();
  // params.categoryName is URL encoded
  const categoryName = decodeURIComponent(params.categoryName);

  const { data: allItems, error, isLoading, mutate } = useSWR("/api/food-items", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 30000,
  });
  
  // Filter items specifically for this category
  const categoryItems = allItems?.filter((item) => item.category_name === categoryName) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, id: null, name: "" });

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleSaveItem = async (data) => {
    try {
      if (editingItem) {
        await api.updateFoodItem(editingItem.food_id, data);
        toast.success("Item updated!");
      } else {
        await api.createFoodItem(data);
        toast.success("Item created!");
      }
      handleCloseModal();
      mutate(); // Refetch cache
    } catch (err) {
      toast.error(err.message || "Failed to save food item");
    }
  };

  const handleDeleteItem = (id, name) => {
    setConfirmState({ isOpen: true, id, name });
  };

  const { showLoading, hideLoading, showError } = useStatus();

  const handleConfirmDelete = async () => {
    setConfirmState({ isOpen: false, id: null, name: "" }); // Close confirm modal first
    showLoading("Deleting item...");
    try {
      await api.deleteFoodItem(confirmState.id);
      toast.success("Item deleted!");
      mutate();
    } catch (err) {
      showError(err.message || "Failed to delete item");
    } finally {
      hideLoading();
    }
  };

  const handleToggleVisibility = async (item) => {
    const newValue = item.is_available === false ? true : false;
    // Optimistic update: flip the flag in cached data immediately
    mutate(
      (current) =>
        current?.map((i) =>
          i.food_id === item.food_id ? { ...i, is_available: newValue } : i
        ),
      false
    );
    try {
      await api.updateFoodItem(item.food_id, {
        food_name: item.food_name,
        price: item.price,
        description: item.description,
        img_url: item.img_url,
        category_name: item.category_name,
        is_available: newValue,
      });
      toast.success(newValue ? "Item is now visible" : "Item hidden from menu");
    } catch (err) {
      // Revert on failure
      mutate();
      toast.error("Failed to update visibility");
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <Link
          prefetch={true}
          href="/dashboard"
          className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-primary-500/20 bg-primary-500/10 text-primary-500 transition-all hover:bg-primary-500 hover:text-white hover:shadow-md"
          title="Back to Categories"
        >
          <FiArrowLeft size={24} />
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-text flex items-center gap-2">
              {categoryName}
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              Manage the food items inside this category.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600 active:scale-95"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Add an Item
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : error ? (
        <EmptyState 
          title="Failed to load"
          description={error.message || "Could not fetch items"}
        />
      ) : categoryItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryItems.map((item) => (
            <div
              key={item.food_id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface-alt transition-all hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10"
            >
              <div className="relative h-40 bg-surface-elevated flex items-center justify-center border-b border-border">
                {item.img_url ? (
                  <img src={item.img_url} alt={item.food_name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <FiImage className="h-10 w-10 text-text-muted opacity-30" />
                )}
                {/* Hidden overlay */}
                {item.is_available === false && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="rounded-full bg-surface/90 px-3 py-1 text-xs font-bold text-text-muted tracking-wide uppercase">Hidden</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-text line-clamp-1">{item.food_name}</h3>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {item.price != null && (
                        <span className="font-semibold text-primary-500">KES {parseFloat(item.price).toFixed(2)}</span>
                      )}
                      {item.is_available === false && (
                        <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Hidden</span>
                      )}
                    </div>
                  </div>
                  {item.description && (
                    <p className="mt-2 text-sm text-text-muted line-clamp-2">{item.description}</p>
                  )}
                </div>
                
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
                  {/* Inline visibility toggle */}
                  <button
                    onClick={() => handleToggleVisibility(item)}
                    title={item.is_available === false ? "Show on public menu" : "Hide from public menu"}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none ${
                      item.is_available === false ? 'bg-border' : 'bg-primary-500'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        item.is_available === false ? 'translate-x-1' : 'translate-x-[18px]'
                      }`}
                    />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-text-muted hover:bg-surface-elevated hover:text-primary-500 transition-colors"
                    >
                      <FiEdit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.food_id, item.food_name)}
                      className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-text-muted hover:bg-surface-elevated hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No Items Yet"
          description={`You haven't added any dishes to ${categoryName}.`}
          icon={FiGrid}
        />
      )}

      {isModalOpen && (
        <MenuItemModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSaveItem}
          initialData={editingItem}
          defaultCategory={categoryName}
        />
      )}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, id: null, name: "" })}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        description={`Are you sure you want to delete "${confirmState.name}"? This cannot be undone.`}
      />
    </div>
  );
}
