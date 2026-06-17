"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { api } from "@/lib/api";
import { groupItemsByCategory } from "@/lib/utils";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import { FiCoffee, FiFolder } from "react-icons/fi";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

const fetcher = (restaurantName) => api.getRestaurantMenu(restaurantName);

export default function PublicMenuPage() {
  const params = useParams();
  const restaurantName = decodeURIComponent(params.restaurantName);

  const { data: menuData, error, isLoading, isValidating } = useSWR(
    `public-menu/${restaurantName}`,
    () => fetcher(restaurantName),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
      errorRetryCount: 2,
    }
  );

  // Only show the skeleton if we don't have data yet. 
  // If we have an error, keep showing the skeleton while SWR retries (isValidating).
  const isActuallyLoading = !menuData && (!error || isValidating);

  const { food_items = [], primary_color, categories: categoryMeta = [] } = menuData || {};

  const categoryImageMap = categoryMeta.reduce((acc, cat) => {
    acc[cat.category_name] = cat.image_url;
    return acc;
  }, {});

  const groupedItems = groupItemsByCategory(food_items);
  const categories = Object.keys(groupedItems);

  const themeColor = primary_color || null;

  useEffect(() => {
    document.title = `${restaurantName} | Menu`;
  }, [restaurantName]);

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text">
      {themeColor && (
        <style>{`:root { --theme-primary: ${themeColor}; }`}</style>
      )}

      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="truncate text-xl font-extrabold text-primary-500">
            {restaurantName}
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-8 text-lg text-text-muted">
          Welcome to <span className="font-semibold text-text">{restaurantName}</span>. Hope you enjoy our hospitality!
        </p>

        <h2 className="mb-6 text-2xl font-bold text-text">Menu</h2>

        {isActuallyLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : error || categories.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              title={error ? "Restaurant Not Found" : "Menu is Empty"}
              description={
                error
                  ? "We couldn't find a menu for this restaurant. Please check the URL."
                  : "This restaurant hasn't added any items to their digital menu yet."
              }
              icon={FiCoffee}
            />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const catImageUrl = categoryImageMap[category];
              return (
                <Link
                  key={category}
                  prefetch={true}
                  href={`/${encodeURIComponent(restaurantName)}/${encodeURIComponent(category)}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface-alt p-6 transition-all hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10"
                >
                  {catImageUrl && (
                    <img
                      src={catImageUrl}
                      alt={category}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-10 transition-opacity group-hover:opacity-20"
                    />
                  )}
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-primary-500/10 text-primary-500">
                      {catImageUrl ? (
                        <img src={catImageUrl} alt={category} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <FiFolder size={24} />
                      )}
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="mt-4 text-xl font-semibold text-text transition-colors group-hover:text-primary-500">
                      {category}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <footer className="mt-12 border-t border-border py-8 text-center">
        <p className="flex flex-col items-center gap-2 text-sm text-text-muted">
          <span>
            Powered by{" "}
            <Link href="/" className="font-bold text-primary-500 transition-colors hover:text-primary-600">
              MyMenu
            </Link>
          </span>
        </p>
      </footer>
    </div>
  );
}
