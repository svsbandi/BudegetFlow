import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header Skeleton */}
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50 shadow-sm">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Overview Skeletons */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-8">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        {/* Main Content Skeletons */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
           <Skeleton className="lg:col-span-2 h-[480px]" />
           <Skeleton className="h-[480px]" />
        </div>
         <Skeleton className="h-48 w-full" />
      </main>
    </div>
  );
}
