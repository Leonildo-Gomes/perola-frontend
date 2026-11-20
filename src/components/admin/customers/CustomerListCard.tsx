"use client";

import * as React from "react";
import {
  Calendar,
  Lock,
  MessageCircle,
  Phone,
  Star,
  User,
} from "lucide-react";
import type { BusinessCustomer } from "@/features/customers/types/customer.types";
import { CustomerTierBadge } from "./CustomerTierBadge";
import { formatCurrency } from "@/lib/utils/utils";
import { cn } from "@/lib/utils/utils";

interface CustomerListCardProps {
  customer: BusinessCustomer;
  onOpenDetail: (customer: BusinessCustomer) => void;
  className?: string;
}

export function CustomerListCard({
  customer,
  onOpenDetail,
  className,
}: CustomerListCardProps) {
  const name = customer.name || (customer as any)?.customerName || "Cliente";
  const phone = customer.phone || (customer as any)?.customerPhone || "";
  const email = customer.email || (customer as any)?.customerEmail || "";
  const tier = customer.tier || (customer as any)?.customerTier || "REGULAR";
  const phoneClean = phone ? phone.replace(/\D/g, "") : "";
  const isVip = tier === "VIP";
  const completedAppointments =
    customer.completedAppointments ||
    customer.totalAppointments ||
    (customer as any)?.totalBookings ||
    0;
  const totalSpentCve =
    customer.totalSpentCve || (customer as any)?.totalSpent || 0;

  return (
    <div
      onClick={() => onOpenDetail(customer)}
      className={cn(
        "rounded-2xl border bg-white p-4 shadow-xs transition-all hover:shadow-md cursor-pointer relative overflow-hidden group",
        isVip ? "border-amber-300 bg-amber-50/15" : "border-slate-200",
        className,
      )}
    >
      {isVip && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-400/15 via-transparent to-transparent pointer-events-none" />
      )}

      {/* Top row: Avatar, Info, Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="h-11 w-11 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center text-sm shadow-xs">
              {name.trim() ? (
                name
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
              ) : (
                <User className="h-5 w-5 text-slate-400" />
              )}
            </div>
            {isVip && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Star className="h-2.5 w-2.5" style={{ fill: "currentColor" }} />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-sm truncate">
              {name}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              {phone ? (phone.startsWith("+") ? phone : `+238 ${phone}`) : "Sem telefone"}
              {email ? ` • ${email}` : ""}
            </p>
          </div>
        </div>

        <CustomerTierBadge tier={tier} size="xs" fullLabel={isVip} />
      </div>

      {/* Metrics Bar */}
      <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl mb-2.5 text-xs">
        <div className="flex items-center gap-1.5 text-slate-700">
          <Calendar className="h-3.5 w-3.5 text-teal-600" />
          <span className="font-semibold">
            {completedAppointments}{" "}
            {completedAppointments === 1 ? "visita" : "visitas"}
          </span>
        </div>
        <div className="w-px h-3.5 bg-slate-200" />
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="font-semibold text-teal-700 font-price">
            {formatCurrency(totalSpentCve)}
          </span>
        </div>
      </div>

      {/* Private Notes preview */}
      {customer.internalNotes && (
        <div className="flex items-start gap-1.5 bg-slate-100/70 p-2 rounded-lg text-xs text-slate-600">
          <Lock className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
          <p className="line-clamp-1 italic text-[11px]">
            {customer.internalNotes}
          </p>
        </div>
      )}
    </div>
  );
}
