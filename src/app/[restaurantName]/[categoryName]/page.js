import { api } from "@/lib/api";
import { groupItemsByCategory } from "@/lib/utils";
import PublicItemList from "@/components/PublicItemList";
import EmptyState from "@/components/EmptyState";
import { FiArrowLeft, FiCoffee } from "react-icons/fi";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const decodedName = decodeURIComponent(resolvedParams.restaurantName);
  const decodedCategory = decodeURIComponent(resolvedParams.categoryName);
  return {
    title: `${decodedCategory} - ${decodedName} | Menu`,
    description: `View the ${decodedCategory} menu for ${decodedName}`,
  };
}

export default async function PublicCategoryPage({ params }) {
  const resolvedParams = await params;
  const restaurantName = decodeURIComponent(resolvedParams.restaurantName);
  const categoryName = decodeURIComponent(resolvedParams.categoryName);

  let menuData = {};
  let errorMsg = null;

  try {
    menuData = await api.getRestaurantMenu(restaurantName);
  } catch (err) {
    errorMsg = err.message;
  }

  const { food_items = [], primary_color } = menuData;

  const groupedItems = groupItemsByCategory(food_items);
  const categoryItems = groupedItems[categoryName] || [];

  const themeColor = primary_color || null;

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text">
      {/* Inject per-restaurant primary color via CSS variable */}
      {themeColor && (
        <style>{`:root { --theme-primary: ${themeColor}; }`}</style>
      )}

      {/* Public Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href={`/${encodeURIComponent(restaurantName)}`}
            className="truncate text-xl font-extrabold text-primary-500 transition-colors hover:text-primary-600"
          >
            {restaurantName}
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Menu Content */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href={`/${encodeURIComponent(restaurantName)}`}
            className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-primary-500/20 bg-primary-500/10 text-primary-500 transition-all hover:bg-primary-500 hover:text-white hover:shadow-md"
            title="Back to Menu"
          >
            <FiArrowLeft size={24} />
          </Link>
          <h1 className="border-b border-border pb-4 text-3xl font-bold text-text">
            {categoryName}
          </h1>
        </div>

        {errorMsg || categoryItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              title={errorMsg ? "Restaurant Not Found" : "Category is Empty"}
              description={
                errorMsg
                  ? "We couldn't find a menu for this restaurant. Please check the URL."
                  : `There are no items in ${categoryName} yet.`
              }
              icon={FiCoffee}
            />
          </div>
        ) : (
          <PublicItemList items={categoryItems} />
        )}
      </main>

      {/* Footer Branding */}
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
