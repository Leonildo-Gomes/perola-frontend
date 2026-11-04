"use client";

import { BadgeCheck, Check, ChevronDown, Store } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { BusinessMembership } from "@/types/auth";

export interface ActiveBusinessSelectorProps {
  memberships: BusinessMembership[];
  activeBusinessId: string | null;
  onSelectBusiness: (businessId: string) => void;
  /** `pill`: bordered pill (desktop bar). `plain`: bold name + chevron (mobile header). */
  variant?: "pill" | "plain";
}

export const businessLabel = (m: BusinessMembership) => m.businessName ?? `Salão ${m.businessId.slice(0, 6)}`;

export function ActiveBusinessSelector({
  memberships,
  activeBusinessId,
  onSelectBusiness,
  variant = "pill",
}: ActiveBusinessSelectorProps) {
  const active = memberships.find((m) => m.businessId === activeBusinessId);
  const name = active ? businessLabel(active) : "Selecionar salão";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Alternar salão ativo"
          className={cn(
            "flex min-h-[44px] max-w-full items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perola-deep",
            variant === "pill"
              ? "rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              : "rounded-lg text-base font-bold text-slate-900",
          )}
        >
          {variant === "pill" && <Store className="h-4 w-4 shrink-0 text-perola-deep" aria-hidden />}
          <span className="truncate">{name}</span>
          {variant === "pill" && active && <BadgeCheck className="h-4 w-4 shrink-0 text-perola-deep" aria-hidden />}
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Os teus salões</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {memberships.length === 0 && (
          <p className="px-2 py-3 text-sm text-slate-500">Ainda não tens nenhum salão associado.</p>
        )}
        {memberships.map((m) => (
          <DropdownMenuItem
            key={m.businessId}
            className="min-h-[44px] justify-between"
            onSelect={() => onSelectBusiness(m.businessId)}
          >
            <span className="flex flex-col">
              <span className="truncate">{businessLabel(m)}</span>
              <span className="text-xs text-slate-500">{m.role === "OWNER" ? "Proprietário" : "Colaborador"}</span>
            </span>
            {m.businessId === activeBusinessId && <Check className="h-4 w-4 text-perola-deep" aria-hidden />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
