import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-text">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>

        {/* Categories Skeleton */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-full" />
          ))}
        </div>

        {/* Items Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </main>
    </div>
  );
}
