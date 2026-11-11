"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";
import { useCategories } from "../hooks/use-categories";

const pill =
  "inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap gap-2 rounded-full border px-4 text-sm font-semibold transition-colors";

export function CategoryPills() {
  const active = useSearchParams().get("category");
  const { data: categories = [], isLoading } = useCategories();

  return (
    <nav
      aria-label="Categorias"
      className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]"
    >
      <ul className="flex gap-2">
        <li>
          <Link
            href="/explore"
            aria-current={!active ? "true" : undefined}
            className={cn(
              pill,
              !active
                ? "border-perola-deep bg-perola-deep text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            )}
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Todos
          </Link>
        </li>

        {isLoading
          ? Array.from({ length: 5 }, (_, i) => (
              <li key={i}>
                <Skeleton className="h-11 w-28 rounded-full" />
              </li>
            ))
          : categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/explore?category=${encodeURIComponent(c.slug)}`}
                  aria-current={active === c.slug ? "true" : undefined}
                  className={cn(
                    pill,
                    active === c.slug
                      ? "border-perola-deep bg-perola-deep text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                >
                  {c.name}
                </Link>
              </li>
            ))}
      </ul>
    </nav>
  );
}
