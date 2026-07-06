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
  const themeColor = primary_color || null;

  useEffect(() => {
    document.title = `${restaurantName} | Welcome`;
  }, [restaurantName]);

  return (
    <div 
      className="relative flex min-h-screen flex-col items-center justify-center text-white px-4 text-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/wecome.jpg')" }}
    >
      {/* Overlay with theme color */}
      <div 
        className="absolute inset-0 opacity-80" 
        style={{ backgroundColor: themeColor || "var(--theme-surface)" }}
      ></div>

      {themeColor && (
        <style>{`:root { --theme-primary: ${themeColor}; }`}</style>
      )}

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
            <h1 className="text-3xl font-extrabold drop-shadow-md">Oops!</h1>
            <p className="text-lg text-white/80 drop-shadow-sm">
              {error?.status === 403
                ? "This menu is currently unavailable."
                : "We couldn't find a menu for this restaurant."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-lg mx-auto animate-in fade-in zoom-in duration-500">
            <div className="mb-8 p-6 inline-flex">
              <h1 
                className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg"
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                {restaurantName}
              </h1>
            </div>
            
            <p className="mb-12 text-xl sm:text-2xl font-medium text-white/90 leading-relaxed drop-shadow-md">
              Hey, welcome to <span className="font-bold">{restaurantName}</span>. 
              <br className="hidden sm:block"/> Hope you enjoy our service!
            </p>

            <Link
              href={`/${encodeURIComponent(restaurantName)}/menu`}
              className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-bold text-black shadow-xl transition-opacity hover:opacity-80"
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
