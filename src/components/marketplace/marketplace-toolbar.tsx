"use client";

import { SlidersHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { CategoryPills } from "./category-pills";
import { SearchBar } from "./search-bar";

/** Search + category pills shown under the header on the marketplace home/explore only. */
export function MarketplaceToolbar() {
  const pathname = usePathname();
  if (pathname !== "/" && pathname !== "/explore") return null;
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 pb-3 pt-1 md:pt-3">
        {/* Mobile search (desktop search lives in the header) */}
        <div className="flex items-center gap-2 md:hidden">
          <SearchBar className="flex-1 rounded-xl bg-slate-50" />
          <button
            type="button"
            aria-label="Filtros"
            className="flex h-12 min-h-[44px] w-12 min-w-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <SlidersHorizontal className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <Suspense fallback={<div className="h-11" />}>
          <CategoryPills />
        </Suspense>
      </div>
    </div>
  );
}
