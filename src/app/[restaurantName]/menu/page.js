"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { api } from "@/lib/api";
import { groupItemsByCategory } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import { FiHome, FiShoppingCart, FiCheck, FiX, FiRefreshCw, FiMinus, FiPlus } from "react-icons/fi";
import { BiDish } from "react-icons/bi";
import Link from "next/link";
import Skeleton from "@/components/Skeleton";
import { socket } from "@/lib/socket";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MenuDivider from "@/components/MenuDivider";

const fetcher = (restaurantName) => api.getRestaurantMenu(restaurantName);

// Helper to get time of day greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function UnifiedMenuPage() {
  const params = useParams();
  const restaurantName = decodeURIComponent(params.restaurantName);

  const { data: menuData, error, isLoading } = useSWR(
    `public-menu/${restaurantName}`,
    () => fetcher(restaurantName),
    {
      revalidateOnFocus: true,
    }
  );

  const { food_items = [], primary_color, categories: categoryMeta = [], orders_enabled } = menuData || {};
  const themeColor = primary_color || null;

  const groupedItems = groupItemsByCategory(food_items);
  const categories = categoryMeta.map((cat) => cat.category_name);
  Object.keys(groupedItems).forEach((cat) => {
    if (!categories.includes(cat)) {
      categories.push(cat);
    }
  });

  const greeting = getGreeting();

  // --- Cart State ---
  // cart = { [food_id]: { item: foodItemObject, quantity: number, special_instructions: string } }
  const [cart, setCart] = useState({});
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");

  // --- Order Status State ---
  const [orderId, setOrderId] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { data: orderStatusData, mutate: mutateOrderStatus } = useSWR(
    orderId ? `/api/orders/${orderId}` : null,
    async (url) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
      if (!res.ok) throw new Error("Could not fetch order status");
      const json = await res.json();
      return json.data;
    }
  );

  useEffect(() => {
    if (orderId && isStatusModalOpen) {
      socket.connect();
      socket.emit("join_order_room", orderId);

      const onStatusUpdated = (updatedOrder) => {
        mutateOrderStatus();
      };

      socket.on("order_status_updated", onStatusUpdated);

      return () => {
        socket.off("order_status_updated", onStatusUpdated);
        socket.disconnect();
      };
    }
  }, [orderId, isStatusModalOpen, mutateOrderStatus]);

  useEffect(() => {
    document.title = `${restaurantName} | Menu`;
  }, [restaurantName]);

  const totalCartItems = useMemo(() => {
    return Object.values(cart).reduce((sum, current) => sum + current.quantity, 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return Object.values(cart).reduce((sum, current) => sum + (parseFloat(current.item.price || 0) * current.quantity), 0);
  }, [cart]);

  const updateQuantity = (item, delta) => {
    setCart((prev) => {
      const currentObj = prev[item.food_id];
      const newQuantity = (currentObj ? currentObj.quantity : 0) + delta;

      if (newQuantity <= 0) {
        const newCart = { ...prev };
        delete newCart[item.food_id];
        if (Object.keys(newCart).length === 0) setIsCartModalOpen(false);
        return newCart;
      }

      return {
        ...prev,
        [item.food_id]: {
          item,
          quantity: newQuantity,
          special_instructions: currentObj ? currentObj.special_instructions : ""
        }
      };
    });
  };

  const updateInstructions = (food_id, text) => {
    setCart((prev) => {
      if (!prev[food_id]) return prev;
      return {
        ...prev,
        [food_id]: {
          ...prev[food_id],
          special_instructions: text
        }
      };
    });
  };

  const handleOrderSubmit = async () => {
    if (!tableNumber.trim()) {
      setSubmitError("Please enter your table number.");
      return;
    }
    setSubmitError("");
    setIsSubmitting(true);

    try {
      // We need to fetch restaurant profile or extract restaurant_id from an item
      // Wait, food_items have restaurant_id! Let's just grab it from the first item.
      const firstCartItem = Object.values(cart)[0].item;
      const rId = firstCartItem.restaurant_id;

      const itemsPayload = Object.values(cart).map(c => ({
        food_item_id: c.item.food_id,
        quantity: c.quantity,
        special_instructions: c.special_instructions
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: rId,
          table_number: tableNumber,
          items: itemsPayload
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to submit order");

      setOrderId(json.data.id);
      setCart({});
      setIsCartModalOpen(false);
      setIsStatusModalOpen(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToCategory = (cat) => {
    const el = document.getElementById(`category-${cat}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-surface p-4">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || categories.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-text-muted">Menu is empty or unavailable.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text pb-24 relative">
      {themeColor && <style>{`:root { --theme-primary: ${themeColor}; }`}</style>}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-primary-500">{restaurantName}</h1>
            <p className="text-sm text-text-muted font-medium">{greeting}</p>
          </div>
          <div className="flex items-center gap-2">
            {orderId && (
              <button
                onClick={() => setIsStatusModalOpen(true)}
                className="px-3 py-1 text-xs font-bold bg-surface-alt rounded-full text-text border border-border"
              >
                View Order
              </button>
            )}
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Category Pills (Horizontal Scroll) */}
        <div className="mx-auto max-w-2xl mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className="whitespace-nowrap rounded-full bg-surface-alt border border-border px-4 py-2 text-sm font-semibold text-text transition-colors hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Menu List */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6">
        {categories.map(cat => {
          const items = groupedItems[cat] || [];
          if (items.length === 0) return null;
          return (
            <div key={cat} id={`category-${cat}`} className="mb-10 scroll-mt-36">
              <h2
                className="text-2xl font-bold text-text"
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                {cat}
              </h2>
              <MenuDivider color={themeColor} />
              <div className="flex flex-col gap-4">
                {items.map(item => {
                  const cartObj = cart[item.food_id];
                  return (
                    <div key={item.food_id} className="relative flex gap-4 rounded-xl overflow-hidden p-4 shadow-sm bg-surface-alt">
                      {/* Blurred background image */}
                      {item.img_url && (
                        <div
                          className="absolute inset-0 scale-110 blur-md"
                          style={{ backgroundImage: `url(${item.img_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        />
                      )}
                      {/* Dark / Light mode overlay */}
                      <div className="absolute inset-0 bg-white/80 dark:bg-black/75" />

                      {/* Thumbnail */}
                      {item.img_url && (
                        <div className="relative z-10 h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                          <img src={item.img_url} alt={item.food_name} className="h-full w-full object-cover" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="relative z-10 flex flex-1 flex-col justify-between">
                        <div>
                          <h3
                            className="font-bold text-lg text-text"
                            style={{ fontFamily: 'var(--font-playfair), serif' }}
                          >
                            {item.food_name}
                          </h3>
                          {item.description && <p className="text-sm text-text-muted mt-1 line-clamp-2">{item.description}</p>}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-bold text-primary-600">
                            {item.price ? `KES ${item.price}` : ''}
                          </span>

                          {orders_enabled && (
                            <div className="flex items-center gap-2">
                              {cartObj ? (
                                <div className="flex items-center gap-3 bg-surface rounded-full px-2 py-1 border border-primary-200">
                                  <button onClick={() => updateQuantity(item, -1)} className="p-1 text-primary-500 hover:bg-primary-50 rounded-full">
                                    <FiMinus size={16} />
                                  </button>
                                  <span className="font-bold text-text min-w-[1rem] text-center">{cartObj.quantity}</span>
                                  <button onClick={() => updateQuantity(item, 1)} className="p-1 text-primary-500 hover:bg-primary-50 rounded-full">
                                    <FiPlus size={16} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => updateQuantity(item, 1)}
                                  className="rounded-full bg-primary-500/80 px-4 py-1.5 text-sm font-bold text-white shadow-sm hover:bg-primary-600/90 transition-colors"
                                >
                                  Order
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>

      {/* Floating Cart Circle */}
      {totalCartItems > 0 && !isCartModalOpen && (
        <button
          onClick={() => setIsCartModalOpen(true)}
          className="fixed bottom-8 right-8 z-40 group flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/40 transition-transform hover:scale-105"
        >
          {/* Rotating Dashed Border */}
          <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-green-400 animate-[spin_4s_linear_infinite]"></div>

          <div className="relative z-10">
            <BiDish size={26} />
            <span className="absolute -top-3 -right-4 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-sm border-2 border-white/20">
              {totalCartItems}
            </span>
          </div>
        </button>
      )}

      {/* Cart Modal */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-border flex justify-between items-center bg-surface-alt">
              <h2 className="text-xl font-bold text-text">Your Order</h2>
              <button onClick={() => setIsCartModalOpen(false)} className="p-2 text-text-muted hover:text-text rounded-full hover:bg-surface">
                <FiX size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex-1">
              {Object.values(cart).map(c => (
                <div key={c.item.food_id} className="flex justify-between items-start py-4 border-b border-border last:border-0 gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-text">{c.item.food_name}</p>
                    <p className="text-sm text-primary-600 font-semibold mb-2">{c.item.price ? `KES ${c.item.price}` : ''}</p>
                    <input
                      type="text"
                      placeholder="Add instructions (e.g. no onions)"
                      value={c.special_instructions || ''}
                      onChange={(e) => updateInstructions(c.item.food_id, e.target.value)}
                      className="w-full text-xs sm:text-sm bg-surface-alt border border-border rounded-lg px-3 py-2 text-text placeholder-text-muted focus:outline-none focus:border-primary-400"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-surface-alt rounded-full px-2 py-1.5 border border-border shrink-0 mt-1">
                    <button onClick={() => updateQuantity(c.item, -1)} className="p-1 text-text-muted hover:text-text">
                      <FiMinus size={16} />
                    </button>
                    <span className="font-bold w-4 text-center">{c.quantity}</span>
                    <button onClick={() => updateQuantity(c.item, 1)} className="p-1 text-text-muted hover:text-text">
                      <FiPlus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border bg-surface-alt">
              <div className="flex justify-between items-center mb-4 text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary-600">KES {totalCartPrice}</span>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1 text-text">Table Number</label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. 5 or Patio 2"
                  className="w-full rounded-lg border border-border bg-surface p-3 text-text focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {submitError && <p className="mb-4 text-sm text-red-500 font-medium">{submitError}</p>}

              <button
                onClick={handleOrderSubmit}
                disabled={isSubmitting}
                className="w-full rounded-full bg-primary-500 py-4 text-lg font-bold text-white shadow-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting ? "Sending..." : "Done"}
                {!isSubmitting && <FiCheck />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Status Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-surface rounded-2xl shadow-2xl p-6 text-center border border-border">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/10 text-primary-500">
                {orderStatusData?.status === 'confirmed' || orderStatusData?.status === 'in_progress' ? (
                  <FiCheck size={32} className="animate-in zoom-in duration-300" />
                ) : (
                  <FiRefreshCw size={32} className="animate-spin" />
                )}
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-text mb-2">
              {orderStatusData?.status === 'pending' ? 'Order Pending' : 'Order Confirmed!'}
            </h2>
            <p className="text-text-muted mb-6">
              {orderStatusData?.status === 'pending'
                ? 'We have received your order and are waiting for the restaurant to confirm it.'
                : 'The restaurant has confirmed your order. It will be ready soon!'}
            </p>

            {orderStatusData?.items && orderStatusData.items.length > 0 && (
              <div className="text-left bg-surface-alt rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
                <h3 className="font-bold text-text border-b border-border pb-2 mb-3">Your Items</h3>
                <ul className="space-y-3">
                  {orderStatusData.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <span className="font-semibold text-text">{item.quantity}x {item.food_name}</span>
                        {item.special_instructions && (
                          <p className="text-text-muted text-xs mt-0.5">Note: {item.special_instructions}</p>
                        )}
                      </div>
                      {item.price && <span className="font-semibold text-primary-600 ml-3">KES {item.price * item.quantity}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => mutateOrderStatus()}
                className="w-full rounded-xl bg-surface-alt border border-border py-3 font-semibold text-text hover:bg-surface transition-colors flex justify-center items-center gap-2"
              >
                <FiRefreshCw /> Recheck Status
              </button>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="w-full rounded-xl bg-text text-surface py-3 font-semibold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
