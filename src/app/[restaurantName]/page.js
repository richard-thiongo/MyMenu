"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { api } from "@/lib/api";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import ThemeToggle from "@/components/ThemeToggle";

const fetcher = (restaurantName) => api.getRestaurantMenu(restaurantName);

// Deterministic pseudo-random from a seed string
function seededRandom(seed, index) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) ^ index * 2654435761;
  return ((h ^ (h >>> 16)) >>> 0) / 0xFFFFFFFF;
}

const SPLASHES = [
  { w: 420, h: 340, blur: 90, opacity: 0.18 },
  { w: 260, h: 260, blur: 70, opacity: 0.12 },
  { w: 340, h: 200, blur: 80, opacity: 0.14 },
  { w: 180, h: 300, blur: 60, opacity: 0.10 },
];

export default function WelcomePage() {
  const params = useParams();
  const rawRestaurantName = params?.restaurantName
    ? Array.isArray(params.restaurantName)
      ? params.restaurantName[0]
      : params.restaurantName
    : "";
  const restaurantName = rawRestaurantName ? decodeURIComponent(rawRestaurantName) : "";

  const { data: menuData, error } = useSWR(
    restaurantName ? `public-menu/${restaurantName}` : null,
    () => fetcher(restaurantName),
    { revalidateOnFocus: false }
  );

  const { primary_color, restaurant_name: realRestaurantName } = menuData || {};
  const themeColor = primary_color || "#6366f1";
  const displayRestaurantName = realRestaurantName || restaurantName;

  useEffect(() => {
    if (displayRestaurantName) {
      document.title = `${displayRestaurantName} | Welcome`;
    }
  }, [displayRestaurantName]);

  // Generate stable splash positions seeded by the restaurant name
  const splashes = useMemo(() => {
    const seed = restaurantName || "default";
    return SPLASHES.map((s, i) => ({
      ...s,
      top: `${seededRandom(seed, i * 3 + 0) * 80}%`,
      left: `${seededRandom(seed, i * 3 + 1) * 80}%`,
      rotate: `${seededRandom(seed, i * 3 + 2) * 60 - 30}deg`,
    }));
  }, [restaurantName]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-950 px-6 text-center transition-colors duration-300 overflow-hidden">

      {/* Color splashes */}
      {splashes.map((s, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            top: s.top,
            left: s.left,
            width: s.w,
            height: s.h,
            background: themeColor,
            opacity: s.opacity,
            filter: `blur(${s.blur}px)`,
            transform: `rotate(${s.rotate})`,
          }}
        />
      ))}

      {/* Theme toggle pinned top-right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {error ? (
        <div className="relative z-10 flex flex-col items-center gap-4">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-extrabold text-gray-900 dark:text-white">
            Oops!
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400">
            {error?.status === 403
              ? "This menu is currently unavailable."
              : "We couldn't find this menu. Please check the link."}
          </p>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Restaurant name */}
          <p
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: themeColor }}
          >
            {displayRestaurantName}
          </p>

          {/* Main heading */}
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-snug max-w-xs sm:max-w-sm">
            Hey! Want to see what we have today?
          </h1>

          {/* CTA button */}
          <Link
            href={`/${encodeURIComponent(restaurantName)}/menu`}
            className="flex items-center gap-3 rounded-xl px-10 py-4 text-base font-bold text-white shadow-lg transition-all hover:brightness-110 hover:shadow-xl active:scale-95"
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 6px 24px ${themeColor}44`,
            }}
          >
            Yes, let&apos;s go
            <FiArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}
