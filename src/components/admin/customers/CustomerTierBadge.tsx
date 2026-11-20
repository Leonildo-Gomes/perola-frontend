"use client";

import * as React from "react";
import {
  AlertTriangle,
  Repeat,
  Sparkles,
  Star,
  UserCheck,
} from "lucide-react";
import type { CustomerTier } from "@/features/customers/types/customer.types";
import { cn } from "@/lib/utils/utils";

export interface CustomerTierBadgeProps {
  tier?: CustomerTier | null;
  size?: "xs" | "sm" | "md";
  fullLabel?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLSpanElement | HTMLButtonElement>) => void;
}

interface TierConfig {
  label: string;
  fullLabel: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconFilled?: boolean;
  classes: string;
}

const TIER_CONFIGS: Record<CustomerTier, TierConfig> = {
  VIP: {
    label: "★ VIP",
    fullLabel: "★ Cliente VIP",
    icon: Star,
    iconFilled: true,
    classes:
      "bg-amber-100 text-amber-800 border-amber-300 font-bold shadow-xs hover:bg-amber-200/80",
  },
  RECURRENT: {
    label: "Recorrente",
    fullLabel: "Cliente Recorrente",
    icon: Repeat,
    classes:
      "bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold hover:bg-emerald-200/80",
  },
  NEW: {
    label: "Novo",
    fullLabel: "Novo Cliente",
    icon: Sparkles,
    classes:
      "bg-teal-100 text-teal-800 border-teal-200 font-semibold hover:bg-teal-200/80",
  },
  REGULAR: {
    label: "Regular",
    fullLabel: "Cliente Regular",
    icon: UserCheck,
    classes:
      "bg-slate-100 text-slate-700 border-slate-200 font-medium hover:bg-slate-200/80",
  },
  WARNING: {
    label: "Atenção",
    fullLabel: "Atenção / Risco",
    icon: AlertTriangle,
    classes:
      "bg-rose-100 text-rose-800 border-rose-300 font-bold hover:bg-rose-200/80",
  },
};

export function CustomerTierBadge({
  tier = "REGULAR",
  size = "sm",
  fullLabel = false,
  interactive = false,
  className,
  onClick,
}: CustomerTierBadgeProps) {
  const activeTier = tier && TIER_CONFIGS[tier] ? tier : "REGULAR";
  const config = TIER_CONFIGS[activeTier];
  const IconComponent = config.icon;

  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5 gap-1",
    sm: "text-[11px] px-2.5 py-0.5 gap-1.5",
    md: "text-xs px-3 py-1 gap-1.5",
  }[size];

  const iconSizeClasses = {
    xs: "h-2.5 w-2.5",
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
  }[size];

  const Component = interactive ? "button" : "span";

  return (
    <Component
      type={interactive ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border transition-all whitespace-nowrap select-none",
        sizeClasses,
        config.classes,
        interactive && "cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1",
        className,
      )}
    >
      <IconComponent
        className={cn(iconSizeClasses, "shrink-0")}
        style={config.iconFilled ? { fill: "currentColor" } : undefined}
      />
      <span>{fullLabel ? config.fullLabel : config.label}</span>
    </Component>
  );
}
