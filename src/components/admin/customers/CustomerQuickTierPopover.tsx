"use client";

import * as React from "react";
import {
  AlertTriangle,
  Check,
  Lock,
  Repeat,
  Save,
  Sparkles,
  Star,
  UserCheck,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { CustomerTier } from "@/features/customers/types/customer.types";
import { useUpdateBusinessCustomer } from "@/features/customers/hooks/use-business-customers";
import { CustomerTierBadge } from "./CustomerTierBadge";
import { cn } from "@/lib/utils/utils";

interface CustomerQuickTierPopoverProps {
  businessId: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  initialTier?: CustomerTier | null;
  initialNotes?: string | null;
  children?: React.ReactNode;
}

const TIERS: {
  value: CustomerTier;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  activeClass: string;
  iconFilled?: boolean;
}[] = [
  {
    value: "NEW",
    label: "Novo",
    icon: Sparkles,
    activeClass: "bg-teal-600 text-white font-bold shadow-xs",
  },
  {
    value: "REGULAR",
    label: "Regular",
    icon: UserCheck,
    activeClass: "bg-slate-700 text-white font-bold shadow-xs",
  },
  {
    value: "RECURRENT",
    label: "Recorrente",
    icon: Repeat,
    activeClass: "bg-emerald-600 text-white font-bold shadow-xs",
  },
  {
    value: "VIP",
    label: "VIP",
    icon: Star,
    iconFilled: true,
    activeClass: "bg-amber-600 text-white font-bold shadow-xs",
  },
  {
    value: "WARNING",
    label: "Atenção",
    icon: AlertTriangle,
    activeClass: "bg-rose-600 text-white font-bold shadow-xs",
  },
];

export function CustomerQuickTierPopover({
  businessId,
  customerId,
  customerName = "Cliente",
  customerPhone,
  initialTier = "REGULAR",
  initialNotes = "",
  children,
}: CustomerQuickTierPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTier, setSelectedTier] = React.useState<CustomerTier>(
    initialTier || "REGULAR",
  );
  const [notes, setNotes] = React.useState<string>(initialNotes || "");

  const updateMutation = useUpdateBusinessCustomer();

  // Keep state in sync with external updates when reopened
  React.useEffect(() => {
    if (open) {
      setSelectedTier(initialTier || "REGULAR");
      setNotes(initialNotes || "");
    }
  }, [open, initialTier, initialNotes]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!businessId || !customerId) return;

    await updateMutation.mutateAsync({
      businessId,
      customerId,
      payload: {
        tier: selectedTier,
        internalNotes: notes.trim() || null,
      },
    });

    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {children ? (
          children
        ) : (
          <button
            type="button"
            className="inline-flex items-center focus:outline-none"
            title="Alterar classificação do cliente"
            onClick={(e) => e.stopPropagation()}
          >
            <CustomerTierBadge tier={initialTier} size="xs" interactive />
          </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="z-50 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold text-slate-900">
              {customerName}
            </h4>
            {customerPhone && (
              <p className="text-xs text-slate-500">+238 {customerPhone}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-3 space-y-3.5">
          {/* Tier selector */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Classificação no Salão
            </label>
            <div className="grid grid-cols-5 gap-1 rounded-xl bg-slate-100 p-1">
              {TIERS.map(({ value, label, icon: Icon, activeClass, iconFilled }) => {
                const isSelected = selectedTier === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedTier(value)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] transition-all",
                      isSelected
                        ? activeClass
                        : "text-slate-600 hover:bg-white hover:text-slate-900",
                    )}
                  >
                    <Icon
                      className="h-3 w-3"
                      style={
                        iconFilled && isSelected
                          ? { fill: "currentColor" }
                          : undefined
                      }
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VIP note callout */}
          {selectedTier === "VIP" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-2 text-[11px] text-amber-900 flex items-start gap-1.5">
              <Star className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" style={{ fill: "currentColor" }} />
              <span>
                Cliente VIP recebe destaque dourado na agenda e prioridade de atendimento.
              </span>
            </div>
          )}

          {/* Private Notes */}
          <div>
            <label
              htmlFor="quick-internal-notes"
              className="mb-1 flex items-center gap-1 text-xs font-semibold text-slate-700"
            >
              <Lock className="h-3 w-3 text-slate-400" />
              <span>Notas Privadas da Equipa</span>
              <span className="text-[10px] font-normal text-slate-400">
                (salão apenas)
              </span>
            </label>
            <textarea
              id="quick-internal-notes"
              rows={2}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Prefere corte com tesoura, café com açúcar..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Footer Save */}
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-7 text-xs rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="brand"
              disabled={updateMutation.isPending}
              className="h-7 text-xs rounded-lg font-semibold"
            >
              <Check className="mr-1 h-3 w-3" />
              {updateMutation.isPending ? "A guardar..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
