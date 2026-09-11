"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { api } from "@/lib/api";
import { groupItemsByCategory } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import {
  FiCheck, FiX, FiMinus, FiPlus, FiSearch, FiShoppingCart, FiArrowRight
} from "react-icons/fi";
import { BiDish } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";
import Skeleton from "@/components/Skeleton";
import MenuDivider from "@/components/MenuDivider";
import useKeyboardOffset from "@/hooks/useKeyboardOffset";

const fetcher = (restaurantName) => api.getRestaurantMenu(restaurantName);

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function UnifiedMenuPage() {
  const params = useParams();
  const rawRestaurantName = params?.restaurantName ? (Array.isArray(params.restaurantName) ? params.restaurantName[0] : params.restaurantName) : "";
  const restaurantName = rawRestaurantName ? decodeURIComponent(rawRestaurantName) : "";

  const { data: menuData, error, isLoading } = useSWR(
    restaurantName ? `public-menu/${restaurantName}` : null,
    () => fetcher(restaurantName),
    { revalidateOnFocus: true }
  );

  const { food_items = [], primary_color, categories: categoryMeta = [], orders_enabled = false, whatsappnumber } = menuData || {};
  const themeColor = primary_color || null;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredFoodItems = useMemo(() => {
    if (!searchQuery.trim()) return food_items;
    const lowerQuery = searchQuery.toLowerCase();
    return food_items.filter(
      (item) =>
        item.food_name.toLowerCase().includes(lowerQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery))
    );
  }, [food_items, searchQuery]);

  const groupedItems = groupItemsByCategory(filteredFoodItems);
  const allCategories = categoryMeta.map((cat) => cat.category_name);
  Object.keys(groupItemsByCategory(food_items)).forEach((cat) => {
    if (!allCategories.includes(cat)) allCategories.push(cat);
  });

  const categories = searchQuery.trim() 
    ? allCategories.filter(cat => groupedItems[cat] && groupedItems[cat].length > 0) 
    : allCategories;

  const greeting = getGreeting();

  // ── State ────────────────────────────────────────────────────────────────
  const [cart, setCart] = useState({});
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Fly-to-cart animation state
  const [flyingItems, setFlyingItems] = useState([]);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [lastAddedImage, setLastAddedImage] = useState(null);

  // Draggable cart button state
  const [cartPos, setCartPos] = useState(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0, moved: false });
  const keyboardOffset = useKeyboardOffset();

  // ── Scroll Spy for Active Category ───────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    if (categories.length === 0) return;
    if (!activeCategory) setActiveCategory(categories[0]);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const catName = entry.target.id.replace("category-", "");
            setActiveCategory(catName);
            const btn = document.getElementById(`pill-${catName}`);
            const container = document.getElementById("category-pills-container");
            if (btn && container) {
              const btnCenter = btn.offsetLeft + btn.offsetWidth / 2;
              const containerCenter = container.offsetWidth / 2;
              container.scrollTo({
                left: btnCenter - containerCenter,
                behavior: "smooth",
              });
            }
          }
        });
      },
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 }
    );

    setTimeout(() => {
      categories.forEach((cat) => {
        const el = document.getElementById(`category-${cat}`);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, [categories]);

  // Drag handlers for the floating cart button
  const onCartPointerDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      originX: cartPos ? cartPos.x : rect.left,
      originY: cartPos ? cartPos.y : rect.top,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onCartPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragRef.current.moved = true;
    if (!dragRef.current.moved) return;
    const size = 72;
    const x = Math.min(Math.max(dragRef.current.originX + dx, 8), window.innerWidth - size - 8);
    const y = Math.min(Math.max(dragRef.current.originY + dy, 8), window.innerHeight - size - 8);
    setCartPos({ x, y });
  };

  const onCartPointerUp = () => {
    dragRef.current.active = false;
  };

  useEffect(() => {
    document.title = `${restaurantName} | Menu`;
  }, [restaurantName]);

  // ── Cart helpers ─────────────────────────────────────────────────────────
  const totalCartItems = useMemo(
    () => Object.values(cart).reduce((s, c) => s + c.quantity, 0),
    [cart]
  );
  const totalCartPrice = useMemo(
    () => Object.values(cart).reduce((s, c) => s + parseFloat(c.item.price || 0) * c.quantity, 0),
    [cart]
  );

  const updateQuantity = (item, delta) => {
    setCart((prev) => {
      const current = prev[item.food_id];
      const newQty = (current ? current.quantity : 0) + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[item.food_id];
        if (Object.keys(next).length === 0) setIsCartModalOpen(false);
        return next;
      }
      return {
        ...prev,
        [item.food_id]: {
          item,
          quantity: newQty,
          special_instructions: current ? current.special_instructions : "",
        },
      };
    });
  };

  // ── Fly-to-cart dropping animation handler ──────────────────────────────
  const handleAddToCart = (e, item) => {
    updateQuantity(item, 1);

    if (item.img_url) setLastAddedImage(item.img_url);

    if (!e || !e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2 - 25;
    const startY = rect.top + rect.height / 2 - 25;

    const targetBtn = document.getElementById("floating-cart-btn");
    const targetRect = targetBtn
      ? targetBtn.getBoundingClientRect()
      : { left: window.innerWidth - 80, top: window.innerHeight - 80, width: 64, height: 64 };

    const targetX = targetRect.left + targetRect.width / 2 - 25;
    const targetY = targetRect.top + targetRect.height / 2 - 25;

    const flyId = Date.now() + Math.random();

    const newFlyItem = {
      id: flyId,
      imgUrl: item.img_url,
      currentX: startX,
      currentY: startY,
      scale: 1,
      opacity: 1,
      rotation: 0,
    };

    setFlyingItems((prev) => [...prev, newFlyItem]);

    setTimeout(() => {
      setFlyingItems((prev) =>
        prev.map((f) =>
          f.id === flyId
            ? {
              ...f,
              currentX: targetX,
              currentY: targetY,
              scale: 0.25,
              opacity: 0.8,
              rotation: 360,
            }
            : f
        )
      );
    }, 30);

    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((f) => f.id !== flyId));
      setIsCartBouncing(true);
      setTimeout(() => setIsCartBouncing(false), 350);
    }, 730);
  };

  const updateInstructions = (food_id, text) => {
    setCart((prev) => {
      if (!prev[food_id]) return prev;
      return { ...prev, [food_id]: { ...prev[food_id], special_instructions: text } };
    });
  };

  // ── Submit order via WhatsApp ───────────────────────────────────────────
  const handleOrderSubmit = () => {
    if (!whatsappnumber) {
      setSubmitError("Ordering is currently unavailable.");
      return;
    }
    setSubmitError("");
    setIsSubmitting(true);
    
    try {
      const hour = new Date().getHours();
      let greeting = "Good evening";
      if (hour < 12) greeting = "Good morning";
      else if (hour < 18) greeting = "Good afternoon";

      let message = `${greeting}! I would like to have these:\n\n`;
      Object.values(cart).forEach((c, index) => {
        message += `${index + 1}. ${c.quantity}x ${c.item.food_name}\n`;
        if (c.special_instructions) {
          message += `   Note: ${c.special_instructions}\n`;
        }
        message += `\n`;
      });
      message += `Thanks!`;
      
      const encodedMessage = encodeURIComponent(message);
      
      let cleanNumber = whatsappnumber.replace(/\D/g, '');
      if (cleanNumber.startsWith('0')) {
        cleanNumber = '254' + cleanNumber.slice(1);
      }
      
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
      
      setCart({});
      setIsCartModalOpen(false);
      
      window.open(whatsappUrl, '_blank');
      
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToCategory = (cat) => {
    document.getElementById(`category-${cat}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Loading / error states ───────────────────────────────────────────────
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

  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-surface text-text pb-24 relative">
      {themeColor && <style>{`:root { --theme-primary: ${themeColor}; }`}</style>}
      <style>{`
        @keyframes ring-spin {
          to { transform: rotate(360deg); }
        }
        .neon-ring {
          background: conic-gradient(
            from 0deg,
            #39ff14,
            #00ffff 20%,
            #0099ff 38%,
            #cc00ff 55%,
            #ff0066 70%,
            #ffcc00 85%,
            #39ff14 100%
          );
          animation: ring-spin 5s linear infinite;
          border-radius: 50%;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15%       { transform: scale(1.07); }
          30%       { transform: scale(1); }
          45%       { transform: scale(1.04); }
          60%       { transform: scale(1); }
        }
        .cart-heartbeat {
          animation: heartbeat 2.4s ease-in-out infinite;
        }
        .cart-bounce {
          animation: none;
          transform: scale(1.3);
          transition: transform 0.2s ease;
        }
      `}</style>

      {/* ── Restaurant Info (Non-sticky) ─────────────────────────────────── */}
      <header className="px-4 py-4 pt-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
          {isSearchOpen ? (
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-alt border border-border text-text focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-2 text-text-muted hover:text-text rounded-full"
              >
                <FiX size={20} />
              </button>
            </div>
          ) : (
            <>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-extrabold text-primary-500 truncate">{restaurantName}</h1>
                <p className="text-sm text-text-muted font-medium">{greeting}</p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-text-muted hover:text-text hover:bg-surface-alt rounded-full transition-colors"
                  aria-label="Search menu"
                >
                  <FiSearch size={20} />
                </button>
                <ThemeToggle />
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── Sticky Category Pills ───────────────────────────────────────── */}
      <div className="sticky top-0 z-30 border-b border-border bg-surface/95 pt-4 pb-3 backdrop-blur-md shadow-sm">
        <div id="category-pills-container" className="mx-auto max-w-2xl flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                id={`pill-${cat}`}
                onClick={() => {
                  setActiveCategory(cat);
                  scrollToCategory(cat);
                }}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-105 border-transparent"
                    : "bg-surface-alt border border-border text-text hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Menu list ────────────────────────────────────────────────────── */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-3 sm:px-4 py-6">
        {categories.map((cat) => {
          const items = groupedItems[cat] || [];
          if (items.length === 0) return null;
          return (
            <div key={cat} id={`category-${cat}`} className="mb-10 scroll-mt-36">
              <h2
                className="text-xl sm:text-2xl font-bold text-text"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {cat}
              </h2>
              <MenuDivider color={themeColor} />
              <div className="flex flex-col gap-4">
                {items.map((item) => {
                  const cartObj = cart[item.food_id];
                  return (
                    <div
                      key={item.food_id}
                      className="relative flex gap-3 sm:gap-4 rounded-xl overflow-hidden p-3 sm:p-4 shadow-sm bg-surface-alt"
                    >
                      {item.img_url && (
                        <div
                          className="absolute inset-0 scale-110 blur-md"
                          style={{ backgroundImage: `url(${item.img_url})`, backgroundSize: "cover", backgroundPosition: "center" }}
                        />
                      )}
                      <div className="absolute inset-0 bg-white/80 dark:bg-black/75" />

                      {item.img_url && (
                        <div className="relative z-10 h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg">
                          <img src={item.img_url} alt={item.food_name} className="h-full w-full object-cover" />
                        </div>
                      )}

                      <div className="relative z-10 flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <h3
                            className="font-bold text-base sm:text-lg text-text"
                            style={{ fontFamily: "var(--font-playfair), serif" }}
                          >
                            {item.food_name}
                          </h3>
                          {item.description && (
                            <p className="text-xs sm:text-sm text-text-muted mt-1 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                        <div className="mt-2 sm:mt-3 flex items-center justify-between flex-wrap gap-2">
                          <span className="font-bold text-primary-600 text-sm sm:text-base">
                            {item.price ? `KES ${item.price}` : ""}
                          </span>
                          {orders_enabled && !!whatsappnumber && (
                            <div className="flex items-center gap-2">
                              {cartObj ? (
                                <div className="flex items-center gap-2 sm:gap-3 bg-surface rounded-full px-2 py-1 border border-primary-200">
                                  <button onClick={() => updateQuantity(item, -1)} className="p-1 text-primary-500 hover:bg-primary-50 rounded-full">
                                    <FiMinus size={14} />
                                 </button>
                                  <span className="font-bold text-text min-w-[1rem] text-center text-sm">
                                    {cartObj.quantity}
                                  </span>
                                  <button onClick={(e) => handleAddToCart(e, item)} className="p-1 text-primary-500 hover:bg-primary-50 rounded-full">
                                    <FiPlus size={14} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => handleAddToCart(e, item)}
                                  className="rounded-full bg-primary-500/80 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-primary-600/90 transition-colors active:scale-95"
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

      {/* ── Floating cart button ─────────────────────────────────────────── */}
      {totalCartItems > 0 && !isCartModalOpen && (
        <div
          id="floating-cart-btn"
          className={`fixed z-40 touch-none select-none ${isCartBouncing ? "cart-bounce" : "cart-heartbeat"}`}
          style={
            cartPos
              ? { left: cartPos.x, top: cartPos.y, bottom: "auto", right: "auto" }
              : { bottom: "1.5rem", right: "1.5rem" }
          }
          onPointerDown={onCartPointerDown}
          onPointerMove={onCartPointerMove}
          onPointerUp={onCartPointerUp}
        >
          <div
            className="neon-ring pointer-events-none absolute"
            style={{ inset: "-2px" }}
          />
          <button
            onClick={() => {
              if (!dragRef.current.moved) setIsCartModalOpen(true);
            }}
            className="relative z-10 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/40 overflow-hidden cursor-grab active:cursor-grabbing transition-shadow"
          >
            {lastAddedImage ? (
              <img
                src={lastAddedImage}
                alt="Last added item"
                className="absolute inset-0 h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="relative z-10">
                <BiDish size={24} />
              </div>
            )}
          </button>
          <span className="pointer-events-none absolute -top-1 -right-1 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow-md">
            {totalCartItems}
          </span>
        </div>
      )}

      {/* ── Flying Food Image Overlay Elements ───────────────────────────── */}
      {flyingItems.map((fly) => (
        <div
          key={fly.id}
          className="fixed z-50 pointer-events-none rounded-full overflow-hidden shadow-2xl border-2 border-primary-500 bg-surface flex items-center justify-center transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{
            left: `${fly.currentX}px`,
            top: `${fly.currentY}px`,
            width: "48px",
            height: "48px",
            transform: `scale(${fly.scale}) rotate(${fly.rotation}deg)`,
            opacity: fly.opacity,
          }}
        >
          {fly.imgUrl ? (
            <img src={fly.imgUrl} alt="Ordering" className="h-full w-full object-cover rounded-full" />
          ) : (
            <BiDish className="text-primary-500" size={26} />
          )}
        </div>
      ))}

      {/* ── Cart modal ───────────────────────────────────────────────────── */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-lg bg-surface rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh]">
            <div className="p-4 border-b border-border flex justify-between items-center bg-surface-alt">
              <h2 className="text-lg sm:text-xl font-bold text-text">Your Order</h2>
              <button onClick={() => setIsCartModalOpen(false)} className="p-2 text-text-muted hover:text-text rounded-full hover:bg-surface">
                <FiX size={22} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex-1">
              {Object.values(cart).map((c) => (
                <div key={c.item.food_id} className="flex justify-between items-start py-3 sm:py-4 border-b border-border last:border-0 gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text text-sm sm:text-base">{c.item.food_name}</p>
                    <p className="text-xs sm:text-sm text-primary-600 font-semibold mb-2">
                      {c.item.price ? `KES ${c.item.price}` : ""}
                    </p>
                    <input
                      type="text"
                      placeholder="Add instructions (e.g. no onions)"
                      value={c.special_instructions || ""}
                      onChange={(e) => updateInstructions(c.item.food_id, e.target.value)}
                      className="w-full text-xs sm:text-sm bg-surface-alt border border-border rounded-lg px-3 py-2 text-text placeholder-text-muted focus:outline-none focus:border-primary-400"
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 bg-surface-alt rounded-full px-2 py-1.5 border border-border shrink-0 mt-1">
                    <button onClick={() => updateQuantity(c.item, -1)} className="p-1 text-text-muted hover:text-text">
                      <FiMinus size={14} />
                    </button>
                    <span className="font-bold w-4 text-center text-sm">{c.quantity}</span>
                    <button onClick={() => updateQuantity(c.item, 1)} className="p-1 text-text-muted hover:text-text">
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border bg-surface-alt">
              <div className="flex justify-between items-center mb-4 text-base sm:text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary-600">KES {totalCartPrice}</span>
              </div>
              
              {submitError && <p className="mb-4 text-sm text-red-500 font-medium">{submitError}</p>}
              <button
                onClick={handleOrderSubmit}
                disabled={isSubmitting}
                className="w-full rounded-full bg-primary-500 py-3 sm:py-4 text-base sm:text-lg font-bold text-white shadow-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98] transition-all"
              >
                {!isSubmitting && <BiDish size={22} />}
                {isSubmitting ? "Finishing..." : "Finish ordering"}
                {!isSubmitting && <FiArrowRight size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}