"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { api } from "@/lib/api";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import Skeleton from "@/components/Skeleton";

const fetcher = (restaurantName) => api.getRestaurantMenu(restaurantName);

export default function WelcomePage() {
  const params = useParams();
  const restaurantName = decodeURIComponent(params.restaurantName);

  const { data: menuData, error, isLoading } = useSWR(
    `public-menu/${restaurantName}`,
    () => fetcher(restaurantName),
    {
      revalidateOnFocus: false,
    }
  );

  const { primary_color } = menuData || {};
  const themeColor = primary_color || "#1800ad";

  useEffect(() => {
    document.title = `${restaurantName} | Welcome`;
  }, [restaurantName]);

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center text-white px-4 text-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/wecome.jpg')" }}
    >
      {/* Inject theme color for CSS var usage */}
      <style>{`:root { --theme-primary: ${themeColor}; }`}</style>

      {/* Dark overlay base */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Brand color radial glow — subtle accent from the bottom-center */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 110%, ${themeColor}55 0%, transparent 70%)`,
        }}
      />

      {/* Top vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Content wrapper to stay above overlay */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {isLoading ? (
          <div className="flex flex-col items-center gap-6">
            <Skeleton className="h-12 w-64 rounded-xl bg-white/20" />
            <Skeleton className="h-6 w-80 rounded-lg bg-white/20" />
            <Skeleton className="h-12 w-48 rounded-full bg-white/20" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-extrabold drop-shadow-md">Oops!</h1>
            <p className="text-lg text-white/80 drop-shadow-sm">
              {error?.status === 403
                ? "This menu is currently unavailable."
                : "We couldn't find a menu for this restaurant."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-lg mx-auto animate-in fade-in zoom-in duration-500">

            {/* Glassmorphism name card */}
            <div
              className="mb-8 px-8 py-5 rounded-2xl border border-white/10 backdrop-blur-sm"
              style={{ background: `${themeColor}22` }}
            >
              <h1
                className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow-lg"
              >
                {restaurantName}
              </h1>
            </div>

            <p className="mb-12 text-lg sm:text-xl font-normal text-white/75 leading-relaxed drop-shadow-md max-w-sm">
              Welcome! We're glad you're here.{" "}
              <br className="hidden sm:block" />
              Browse our menu and enjoy.
            </p>

            <Link
              href={`/${encodeURIComponent(restaurantName)}/menu`}
              className="group flex items-center gap-3 rounded-full px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
              style={{
                background: themeColor,
                boxShadow: `0 8px 32px ${themeColor}66`,
              }}
            >
              View our menu
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
