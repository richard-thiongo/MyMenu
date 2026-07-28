"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { api } from "@/lib/api";
import { groupItemsByCategory } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import {
  FiCheck, FiX, FiRefreshCw, FiMinus, FiPlus, FiClock, FiTrash2,
} from "react-icons/fi";
import { BiDish } from "react-icons/bi";
import { LuHistory } from "react-icons/lu";
import Skeleton from "@/components/Skeleton";
import { socket } from "@/lib/socket";
import MenuDivider from "@/components/MenuDivider";
import useKeyboardOffset from "@/hooks/useKeyboardOffset";

const fetcher = (restaurantName) => api.getRestaurantMenu(restaurantName);

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// ── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending: { label: "Pending", cls: "bg-amber-100  text-amber-700  dark:bg-amber-900/40  dark:text-amber-300" },
    confirmed: { label: "Confirmed", cls: "bg-green-100  text-green-700  dark:bg-green-900/40  dark:text-green-300" },
    in_progress: { label: "In Progress", cls: "bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-300" },
    completed: { label: "Completed", cls: "bg-surface-alt text-text-muted" },
  };
  const { label, cls } = map[status] || { label: status, cls: "bg-surface-alt text-text-muted" };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

// ── Analog-style clock SVG (decorative, not real-time) ───────────────────────
function ClockFace({ size = 36 }) {
  const r = size / 2;
  const now = new Date();
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const hAngle = ((h + m / 60) / 12) * 360 - 90;
  const mAngle = (m / 60) * 360 - 90;
  const toXY = (angle, len) => ({
    x: r + len * Math.cos((angle * Math.PI) / 180),
    y: r + len * Math.sin((angle * Math.PI) / 180),
  });
  const hPt = toXY(hAngle, r * 0.5);
  const mPt = toXY(mAngle, r * 0.72);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={r} cy={r} r={r - 1} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      {[0, 90, 180, 270].map((deg) => {
        const p = toXY(deg - 90, r - 4);
        return <circle key={deg} cx={p.x} cy={p.y} r="1.2" fill="currentColor" opacity="0.5" />;
      })}
      {/* hour hand */}
      <line x1={r} y1={r} x2={hPt.x} y2={hPt.y} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* minute hand */}
      <line x1={r} y1={r} x2={mPt.x} y2={mPt.y} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={r} cy={r} r="1.8" fill="currentColor" />
    </svg>
  );
}

// ── History entry fetcher (status only) ─────────────────────────────────────
function HistoryOrderRow({ entry, onView }) {
  const { data } = useSWR(
    `/api/orders/${entry.id}`,
    async (url) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    }
  );

  const status = data?.status || "pending";
  const time = new Date(entry.placedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0 gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text truncate">
          Table {entry.table}
          <span className="text-text-muted font-normal ml-2 text-xs">{time}</span>
        </p>
        <p className="text-xs text-text-muted mt-0.5">
          {entry.itemNames.slice(0, 3).join(", ")}
          {entry.itemNames.length > 3 ? ` +${entry.itemNames.length - 3} more` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={status} />
        <button
          onClick={() => onView(entry.id)}
          className="text-xs font-semibold text-primary-500 hover:underline whitespace-nowrap"
        >
          View
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
export default function UnifiedMenuPage() {
  const params = useParams();
  const rawRestaurantName = params?.restaurantName ? (Array.isArray(params.restaurantName) ? params.restaurantName[0] : params.restaurantName) : "";
  const restaurantName = rawRestaurantName ? decodeURIComponent(rawRestaurantName) : "";

  const { data: menuData, error, isLoading } = useSWR(
    restaurantName ? `public-menu/${restaurantName}` : null,
    () => fetcher(restaurantName),
    { revalidateOnFocus: true }
  );

  const { food_items = [], primary_color, categories: categoryMeta = [], orders_enabled } = menuData || {};
  const themeColor = primary_color || null;

  const groupedItems = groupItemsByCategory(food_items);
  const categories = categoryMeta.map((cat) => cat.category_name);
  Object.keys(groupedItems).forEach((cat) => {
    if (!categories.includes(cat)) categories.push(cat);
  });

  const greeting = getGreeting();

  // ── Storage keys ────────────────────────────────────────────────────────
  const storageKey = `activeOrder_${restaurantName}`;
  const historyKey = `orderHistory_${restaurantName}`;
  const todayStr = new Date().toLocaleDateString();

  // ── State ────────────────────────────────────────────────────────────────
  const [cart, setCart] = useState({});
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");

  const [orderId, setOrderId] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // history = array of { id, table, date, placedAt, itemNames[] }
  const [orderHistory, setOrderHistory] = useState([]);

  // Fly-to-cart animation state
  const [flyingItems, setFlyingItems] = useState([]);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [lastAddedImage, setLastAddedImage] = useState(null);

  // Draggable cart button state
  const [cartPos, setCartPos] = useState(null); // null = default bottom-right corner
  const dragRef = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0, moved: false });
  const [isHistoryBouncing, setIsHistoryBouncing] = useState(false);

  const keyboardOffset = useKeyboardOffset();

  // ── On mount: restore active order + history ─────────────────────────────
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
    // Clamp within viewport
    const size = 72;
    const x = Math.min(Math.max(dragRef.current.originX + dx, 8), window.innerWidth - size - 8);
    const y = Math.min(Math.max(dragRef.current.originY + dy, 8), window.innerHeight - size - 8);
    setCartPos({ x, y });
  };

  const onCartPointerUp = () => {
    dragRef.current.active = false;
  };

  // ── On mount: restore active order + history ─────────────────────────────
  useEffect(() => {
    // Active order
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { id, table, date } = JSON.parse(saved);
        if (id && date === todayStr) {
          setOrderId(id);
          setTableNumber(table || "");
          setIsStatusModalOpen(true);
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch {
      localStorage.removeItem(storageKey);
    }

    // History (today only)
    try {
      const saved = localStorage.getItem(historyKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const todayEntries = parsed.filter((e) => e.date === todayStr);
        if (todayEntries.length !== parsed.length) {
          localStorage.setItem(historyKey, JSON.stringify(todayEntries));
        }
        setOrderHistory(todayEntries);
      }
    } catch {
      localStorage.removeItem(historyKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Total items count in history (sum of items inside all historical orders)
  const totalHistoryItemsCount = useMemo(() => {
    // Each entry has `itemNames` which represents the items ordered.
    // If table/items list details are saved in entry, let's sum them up.
    return orderHistory.reduce((acc, entry) => {
      // In handleOrderSubmit, entry.itemNames is an array of names representing ordered items.
      // If we don't have exact quantities stored in history entries, the length of itemNames is the item count.
      return acc + (entry.itemNames ? entry.itemNames.length : 0);
    }, 0);
  }, [orderHistory]);

  // Modal folding close animation state
  const [isHistoryClosing, setIsHistoryClosing] = useState(false);
  const [foldTarget, setFoldTarget] = useState({ x: 0, y: 0 });

  const startHistoryCloseAnimation = () => {
    setIsHistoryOpen(false);
    setIsHistoryClosing(false);
    
    // Trigger history button to beat once and shimmer
    setIsHistoryBouncing(true);
    setTimeout(() => {
      setIsHistoryBouncing(false);
    }, 1800); // Duration matches the beat + shimmer animation cycle
  };

  // ── SWR: active order status ─────────────────────────────────────────────
  const { data: orderStatusData, mutate: mutateOrderStatus } = useSWR(
    orderId ? `/api/orders/${orderId}` : null,
    async (url) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
      if (!res.ok) throw new Error("Could not fetch order status");
      const json = await res.json();
      return json.data;
    }
  );

  // ── Socket: real-time status updates ─────────────────────────────────────
  useEffect(() => {
    if (orderId && isStatusModalOpen) {
      socket.connect();
      socket.emit("join_order_room", orderId);
      const onStatusUpdated = () => mutateOrderStatus();
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

    // Always update the last added image
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

  // ── Helpers: persist history ─────────────────────────────────────────────
  const saveHistory = (entries) => {
    setOrderHistory(entries);
    localStorage.setItem(historyKey, JSON.stringify(entries));
  };

  // ── Submit order ─────────────────────────────────────────────────────────
  const handleOrderSubmit = async () => {
    if (!tableNumber.trim()) {
      setSubmitError("Please enter your table number.");
      return;
    }
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const firstCartItem = Object.values(cart)[0].item;
      const rId = firstCartItem.restaurant_id;

      const itemsPayload = Object.values(cart).map((c) => ({
        food_item_id: c.item.food_id,
        quantity: c.quantity,
        special_instructions: c.special_instructions,
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant_id: rId, table_number: tableNumber, items: itemsPayload }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to submit order");

      const newOrderId = json.data.id;

      // Persist active order
      setOrderId(newOrderId);
      localStorage.setItem(storageKey, JSON.stringify({ id: newOrderId, table: tableNumber, date: todayStr }));

      // Append to history
      const newEntry = {
        id: newOrderId,
        table: tableNumber,
        date: todayStr,
        placedAt: new Date().toISOString(),
        itemNames: Object.values(cart).map((c) => c.item.food_name),
      };
      saveHistory([newEntry, ...orderHistory]);

      // ── Fly-to-History Animation ─────────────────────────────────────────
      // Locate the destination (History button)
      const historyBtn = document.getElementById("history-clock-btn");
      const targetRect = historyBtn
        ? historyBtn.getBoundingClientRect()
        : { left: window.innerWidth - 120, top: 20, width: 44, height: 44 };

      const targetX = targetRect.left + targetRect.width / 2 - 25;
      const targetY = targetRect.top + targetRect.height / 2 - 25;

      // Capture all item images in the cart
      const cartItemsWithImages = Object.values(cart).filter((c) => c.item.img_url);
      
      // Let's launch a fly animation for each image
      cartItemsWithImages.forEach((c, index) => {
        const flyId = Date.now() + Math.random() + index;
        // Start from viewport center area (since placing order happens from cart modal)
        const startX = window.innerWidth / 2 - 25;
        const startY = window.innerHeight / 2 - 25;

        // Set last ordered image as history button background
        if (index === cartItemsWithImages.length - 1) {
          setLastAddedImage(c.item.img_url);
        }

        const newFlyItem = {
          id: flyId,
          imgUrl: c.item.img_url,
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
        }, 50 + index * 100);

        setTimeout(() => {
          setFlyingItems((prev) => prev.filter((f) => f.id !== flyId));
          setIsHistoryBouncing(true);
          setTimeout(() => setIsHistoryBouncing(false), 350);
        }, 750 + index * 100);
      });

      setCart({});
      setIsCartModalOpen(false);
      setIsStatusModalOpen(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Clear active order on Close, then open history panel ───────────────
  const handleCloseStatus = () => {
    setIsStatusModalOpen(false);
    const done =
      orderStatusData?.status === "confirmed" ||
      orderStatusData?.status === "in_progress" ||
      orderStatusData?.status === "completed";
    if (done) {
      // Clear active order tracking but KEEP it in history so the customer
      // can still see what they ordered today
      localStorage.removeItem(storageKey);
      setOrderId(null);
    }
    // Always open the history panel after closing so they see their orders
    if (orderHistory.length > 0) {
      setIsHistoryOpen(true);
    }
  };

  // ── Manually clear all history ───────────────────────────────────────────
  const handleClearHistory = () => {
    localStorage.removeItem(historyKey);
    localStorage.removeItem(storageKey);
    setOrderHistory([]);
    setOrderId(null);
    setIsHistoryClosing(true);
    setTimeout(() => {
      setIsHistoryOpen(false);
      setIsHistoryClosing(false);
    }, 450);
  };

  // ── Jump to a specific order from history ────────────────────────────────
  const viewOrderFromHistory = (id) => {
    setOrderId(id);
    setIsHistoryClosing(true);
    setTimeout(() => {
      setIsHistoryOpen(false);
      setIsHistoryClosing(false);
      setIsStatusModalOpen(true);
    }, 450);
  };

  const scrollToCategory = (cat) => {
    document.getElementById(`category-${cat}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Show clock button only when there is something to show ───────────────
  const hasHistory = orderHistory.length > 0;

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
    <div className="flex min-h-screen flex-col bg-surface text-text pb-24 relative">
      {themeColor && <style>{`:root { --theme-primary: ${themeColor}; }`}</style>}
      {/* Conic-gradient rotating ring for cart button — all colors visible simultaneously */}
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
        @keyframes history-beat-shimmer {
          0% { transform: scale(1); }
          14% { transform: scale(1.22); }
          28% { transform: scale(0.95); }
          42% { transform: scale(1.08); }
          56% { transform: scale(1); }
          70% { filter: brightness(1) drop-shadow(0 0 0px var(--theme-primary)); }
          85% { filter: brightness(1.4) drop-shadow(0 0 8px var(--theme-primary)); }
          100% { filter: brightness(1) drop-shadow(0 0 0px var(--theme-primary)); }
        }
        .history-trigger-anim {
          animation: history-beat-shimmer 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 px-4 py-3 sm:py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-extrabold text-primary-500 truncate">{restaurantName}</h1>
            <p className="text-xs sm:text-sm text-text-muted font-medium">{greeting}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* History button — glass overlay + history icon always visible */}
            {hasHistory && (
              <button
                id="history-clock-btn"
                onClick={() => setIsHistoryOpen(true)}
                aria-label="View order history"
                className={`relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full overflow-hidden shadow-md active:scale-95 ring-1 ring-border transition-all ${
                  isHistoryBouncing ? "history-trigger-anim" : ""
                }`}
              >
                {/* Background — last added image or gradient fallback */}
                {lastAddedImage ? (
                  <img
                    src={lastAddedImage}
                    alt="Last ordered item"
                    className="absolute inset-0 h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600" />
                )}
                {/* Glass overlay */}
                <div className="absolute inset-0 rounded-full bg-black/35 backdrop-blur-[2px]" />
                {/* History icon */}
                <span className="relative z-10 text-white">
                  <LuHistory size={18} />
                </span>
                {/* Badge showing count */}
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[9px] font-bold text-white shadow z-20">
                  {totalHistoryItemsCount}
                </span>
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Category pills */}
        <div className="mx-auto max-w-2xl mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className="whitespace-nowrap rounded-full bg-surface-alt border border-border px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-text transition-colors hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

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
                          {orders_enabled && (
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
          {/* Conic-gradient ring — sits outside button */}
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
          {/* Count badge — on wrapper so overflow-hidden on button never clips it */}
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
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 transition-all duration-200"
          style={keyboardOffset > 0 ? { paddingBottom: `${keyboardOffset + 12}px` } : {}}
        >
          <div className="w-full max-w-lg bg-surface rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[85vh]">
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
                className="w-full rounded-full bg-primary-500 py-3 sm:py-4 text-base sm:text-lg font-bold text-white shadow-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98] transition-all"
              >
                {isSubmitting ? "Sending..." : "Place Order"}
                {!isSubmitting && <FiCheck />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Status Modal ───────────────────────────────────────────── */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-surface rounded-2xl shadow-2xl overflow-hidden border border-border">

            {/* ── PENDING: rich loading state ─────────────────────────────── */}
            {(!orderStatusData || orderStatusData?.status === "pending") && (
              <div className="p-6 sm:p-8 text-center">

                {/* Animated progress ring */}
                <div className="flex justify-center mb-5">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                    {/* SVG ring */}
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor"
                        strokeWidth="4" className="text-border" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor"
                        strokeWidth="4" strokeLinecap="round"
                        strokeDasharray="213.6" strokeDashoffset="60"
                        className="text-primary-500 animate-[spin_2s_linear_infinite]"
                        style={{ transformOrigin: "center" }} />
                    </svg>
                    {/* Inner clock icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-primary-500">
                      <FiClock size={28} />
                    </div>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-text mb-2">
                  Please Wait as We Confirm
                </h2>
                <p className="text-sm text-text-muted mb-5">
                  We have received your order and we are reviewing it right now.
                </p>

                {/* Animated bouncing dots */}
                <div className="flex justify-center items-center gap-2 mb-6">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2.5 w-2.5 rounded-full bg-primary-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </div>

                {/* Real order items list */}
                {orderStatusData?.items?.length > 0 ? (
                  <div className="text-left bg-surface-alt rounded-xl p-4 mb-6 max-h-44 overflow-y-auto">
                    <h3 className="font-bold text-text border-b border-border pb-2 mb-3 text-sm flex justify-between items-center">
                      <span>Your Order</span>
                      {(orderStatusData?.table_number || tableNumber) && (
                        <span className="text-xs font-normal text-text-muted">Table {orderStatusData?.table_number || tableNumber}</span>
                      )}
                    </h3>
                    <ul className="space-y-2.5">
                      {orderStatusData.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-start text-xs sm:text-sm">
                          <div className="flex-1">
                            <span className="font-semibold text-text">
                              {item.quantity}x {item.food_name || item.item_name || "Item"}
                            </span>
                            {item.special_instructions && (
                              <p className="text-text-muted text-xs mt-0.5">Note: {item.special_instructions}</p>
                            )}
                          </div>
                          {item.price && (
                            <span className="font-semibold text-primary-600 ml-3">
                              KES {item.price * item.quantity}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  (() => {
                    const historyMatch = orderHistory.find((o) => o.id === orderId);
                    if (!historyMatch) return null;
                    return (
                      <div className="text-left bg-surface-alt rounded-xl p-4 mb-6">
                        <h3 className="font-bold text-text border-b border-border pb-2 mb-3 text-sm flex justify-between items-center">
                          <span>Your Order</span>
                          <span className="text-xs font-normal text-text-muted">Table {historyMatch.table}</span>
                        </h3>
                        <ul className="space-y-1.5 text-xs sm:text-sm">
                          {historyMatch.itemNames.map((name, idx) => (
                            <li key={idx} className="text-text font-medium flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                              {name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()
                )}

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => mutateOrderStatus()}
                    className="w-full rounded-xl bg-surface-alt border border-border py-3 font-semibold text-text hover:bg-surface transition-colors flex justify-center items-center gap-2 text-sm"
                  >
                    <FiRefreshCw size={14} /> Recheck Status
                  </button>
                  <button
                    onClick={handleCloseStatus}
                    className="w-full rounded-xl bg-text text-surface py-3 font-semibold hover:opacity-90 transition-opacity text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* ── CONFIRMED / IN PROGRESS: success state ──────────────────── */}
            {(orderStatusData?.status === "confirmed" || orderStatusData?.status === "in_progress" || orderStatusData?.status === "completed") && (
              <div className="p-5 sm:p-6 text-center">

                {/* Success icon */}
                <div className="flex justify-center mb-4">
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20">
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-green-500/15 text-green-500">
                      <FiCheck size={32} />
                    </div>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-text mb-2">Order Confirmed!</h2>
                <p className="text-sm sm:text-base text-text-muted mb-5">
                  We have confirmed your order! We are preparing it for you now.
                </p>

                {/* Items list */}
                {orderStatusData?.items?.length > 0 && (
                  <div className="text-left bg-surface-alt rounded-xl p-4 mb-5 max-h-44 overflow-y-auto">
                    <h3 className="font-bold text-text border-b border-border pb-2 mb-3 text-sm">Your Items</h3>
                    <ul className="space-y-2.5">
                      {orderStatusData.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-start text-xs sm:text-sm">
                          <div className="flex-1">
                            <span className="font-semibold text-text">
                              {item.quantity}x {item.food_name}
                            </span>
                            {item.special_instructions && (
                              <p className="text-text-muted text-xs mt-0.5">Note: {item.special_instructions}</p>
                            )}
                          </div>
                          {item.price && (
                            <span className="font-semibold text-primary-600 ml-3">
                              KES {item.price * item.quantity}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => mutateOrderStatus()}
                    className="w-full rounded-xl bg-surface-alt border border-border py-3 font-semibold text-text hover:bg-surface transition-colors flex justify-center items-center gap-2 text-sm sm:text-base"
                  >
                    <FiRefreshCw size={15} /> Recheck Status
                  </button>
                  <button
                    onClick={handleCloseStatus}
                    className="w-full rounded-xl bg-text text-surface py-3 font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── History Modal ─────────────────────────────────────────────────── */}
      {isHistoryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 opacity-100"
          onClick={startHistoryCloseAnimation}
        >
          <div
            className="w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[75vh] sm:max-h-[80vh] animate-in slide-in-from-bottom-5 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pull handle — mobile only */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500">
                  <LuHistory size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-text text-base leading-tight">Order History</h2>
                  <p className="text-xs text-text-muted">{totalHistoryItemsCount} item{totalHistoryItemsCount !== 1 ? "s" : ""} today</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {orderHistory.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    title="Clear history"
                    aria-label="Clear order history"
                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
                <button
                  onClick={startHistoryCloseAnimation}
                  className="p-2 text-text-muted hover:text-text rounded-xl hover:bg-surface-alt transition-colors"
                  aria-label="Close"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Order list */}
            <div className="overflow-y-auto flex-1 px-4 py-3 pb-6">
              {orderHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-text-muted gap-3">
                  <LuHistory size={36} className="opacity-30" />
                  <p className="text-sm">No orders placed today yet.</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {orderHistory.map((entry) => (
                    <HistoryOrderRow key={entry.id} entry={entry} onView={viewOrderFromHistory} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}