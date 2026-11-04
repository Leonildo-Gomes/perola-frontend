"use client";

import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BusinessMembership } from "@/types/auth";

export interface ActiveBusinessSelectorProps {
  memberships: BusinessMembership[];
  activeBusinessId: string | null;
  onSelectBusiness: (businessId: string) => void;
}

export function ActiveBusinessSelector({
  memberships,
  activeBusinessId,
  onSelectBusiness,
}: ActiveBusinessSelectorProps) {
  const active = memberships.find((m) => m.businessId === activeBusinessId);
  const labelOf = (m: BusinessMembership) => m.businessName ?? `Salão ${m.businessId.slice(0, 6)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="max-w-[14rem] gap-2 px-3" aria-label="Alternar salão ativo">
          <Building2 className="h-4 w-4 shrink-0 text-teal-600" aria-hidden />
          <span className="truncate">{active ? labelOf(active) : "Selecionar salão"}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </Button>
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
              <span className="truncate">{labelOf(m)}</span>
              <span className="text-xs text-slate-500">{m.role === "OWNER" ? "Proprietário" : "Colaborador"}</span>
            </span>
            {m.businessId === activeBusinessId && <Check className="h-4 w-4 text-teal-600" aria-hidden />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
