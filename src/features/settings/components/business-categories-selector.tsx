"use client";

import { AlertTriangle, Check, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/features/marketplace/hooks/use-categories";
import { cn } from "@/lib/utils/utils";
import type { BusinessCategoryItemRequest } from "../types/settings.types";

interface BusinessCategoriesSelectorProps {
  value: BusinessCategoryItemRequest[];
  onChange: (next: BusinessCategoryItemRequest[]) => void;
  disabled?: boolean;
  error?: string;
}

export function BusinessCategoriesSelector({
  value,
  onChange,
  disabled = false,
  error,
}: BusinessCategoriesSelectorProps) {
  const { data: categories = [], isLoading, isError, refetch } = useCategories();

  const toggleCategory = (categoryId: string) => {
    if (disabled) return;
    const exists = value.find((item) => item.categoryId === categoryId);

    if (exists) {
      const remaining = value.filter((item) => item.categoryId !== categoryId);
      if (exists.isPrimary && remaining.length > 0) {
        onChange(
          remaining.map((item, idx) => ({
            ...item,
            isPrimary: idx === 0,
          })),
        );
      } else {
        onChange(remaining);
      }
      return;
    }

    onChange([
      ...value,
      {
        categoryId,
        isPrimary: value.length === 0,
      },
    ]);
  };

  const setPrimaryCategory = (categoryId: string) => {
    if (disabled) return;
    const exists = value.some((item) => item.categoryId === categoryId);
    if (!exists) {
      onChange([
        ...value.map((item) => ({ ...item, isPrimary: false })),
        { categoryId, isPrimary: true },
      ]);
      return;
    }

    onChange(
      value.map((item) => ({
        ...item,
        isPrimary: item.categoryId === categoryId,
      })),
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-2" aria-busy="true" aria-label="A carregar categorias">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
        <span className="flex items-center gap-1.5 font-semibold">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Não foi possível carregar as categorias disponíveis.
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => void refetch()}
          className="h-9 rounded-lg border-rose-300 bg-white text-rose-700 hover:bg-rose-100"
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div
        role="group"
        aria-label="Categorias do estabelecimento"
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {categories.map((cat) => {
          const selectedItem = value.find((item) => item.categoryId === cat.id);
          const isSelected = Boolean(selectedItem);
          const isPrimary = Boolean(selectedItem?.isPrimary);

          return (
            <div
              key={cat.id}
              className={cn(
                "flex min-h-[48px] items-center justify-between gap-2 rounded-xl border p-2 transition-colors",
                isSelected
                  ? isPrimary
                    ? "border-perola-deep bg-perola-mint/40"
                    : "border-teal-300 bg-teal-50/50"
                  : "border-slate-200 bg-white hover:bg-slate-50",
                disabled && "opacity-60 pointer-events-none",
              )}
            >
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                aria-pressed={isSelected}
                className="flex min-h-[40px] min-w-0 flex-1 items-center gap-2.5 px-1.5 text-left"
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    isSelected
                      ? "border-perola-deep bg-perola-deep text-white"
                      : "border-slate-300 bg-white",
                  )}
                  aria-hidden
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="truncate text-sm font-semibold text-slate-800">
                  {cat.name}
                </span>
              </button>

              {isSelected && (
                <button
                  type="button"
                  onClick={() => setPrimaryCategory(cat.id)}
                  aria-label={
                    isPrimary
                      ? `${cat.name} é a categoria principal`
                      : `Definir ${cat.name} como categoria principal`
                  }
                  aria-pressed={isPrimary}
                  className={cn(
                    "inline-flex min-h-[36px] shrink-0 items-center gap-1 rounded-lg px-2.5 text-[11px] font-bold transition-colors",
                    isPrimary
                      ? "bg-perola-deep text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-perola-deep/40 hover:text-perola-deep",
                  )}
                >
                  <Star
                    className={cn(
                      "h-3 w-3",
                      isPrimary ? "fill-amber-300 text-amber-300" : "",
                    )}
                    aria-hidden
                  />
                  {isPrimary ? "Principal" : "Tornar Principal"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {error ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : (
        <p className="text-xs text-slate-400">
          Espaço misto? Pode escolher várias categorias e destacar 1 como{" "}
          <strong className="font-semibold text-slate-600">Principal</strong>.
        </p>
      )}
    </div>
  );
}

