"use client";

import * as React from "react";
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lock,
  MessageCircle,
  Phone,
  Plus,
  Repeat,
  Search,
  Sparkles,
  Star,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/feedback";
import { useTenantStore } from "@/stores/tenant-store";
import { useAuthStore } from "@/stores/auth-store";
import { useBusinessCustomers } from "../hooks/use-business-customers";
import type {
  BusinessCustomer,
  CustomerTier,
} from "../types/customer.types";
import {
  CustomerDetailSheet,
  CustomerListCard,
  CustomerTierBadge,
} from "@/components/admin/customers";
import { formatCurrency } from "@/lib/utils/utils";
import { formatInstantLong, formatTime } from "@/lib/utils/datetime";
import { cn } from "@/lib/utils/utils";

const FILTER_PILLS: {
  value: CustomerTier | "ALL";
  label: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconFilled?: boolean;
  activeColor: string;
}[] = [
    { value: "ALL", label: "Todos", activeColor: "bg-teal-600 text-white font-bold" },
    {
      value: "VIP",
      label: "★ VIP",
      icon: Star,
      iconFilled: true,
      activeColor: "bg-amber-600 text-white font-bold",
    },
    {
      value: "RECURRENT",
      label: "Recorrentes",
      icon: Repeat,
      activeColor: "bg-emerald-600 text-white font-bold",
    },
    {
      value: "NEW",
      label: "Novos",
      icon: Sparkles,
      activeColor: "bg-teal-600 text-white font-bold",
    },
    {
      value: "REGULAR",
      label: "Regulares",
      icon: UserCheck,
      activeColor: "bg-slate-700 text-white font-bold",
    },
    {
      value: "WARNING",
      label: "Atenção",
      icon: AlertTriangle,
      activeColor: "bg-rose-600 text-white font-bold",
    },
  ];

const PAGE_SIZE = 20;

export function CustomersContainer() {
  const activeBusinessId = useTenantStore((s) => s.activeBusinessId);
  const memberships = useAuthStore((s) => s.memberships);
  const activeBusiness = memberships.find((m) => m.businessId === activeBusinessId);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedTier, setSelectedTier] = React.useState<CustomerTier | "ALL">("ALL");
  const [page, setPage] = React.useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState<BusinessCustomer | null>(null);

  // Debounce search input by 300ms
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, refetch } = useBusinessCustomers(
    activeBusinessId,
    {
      search: debouncedSearch || undefined,
      tier: selectedTier === "ALL" ? undefined : selectedTier,
      page,
      size: PAGE_SIZE,
    },
  );

  const customers = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  const handleOpenDetail = (customer: BusinessCustomer) => {
    setSelectedCustomer(customer);
    setSelectedCustomerId(customer.customerId || (customer as any)?.id || null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 shadow-xs">
              <Users className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Carteira de Clientes
            </h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
              {totalElements}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {activeBusiness?.businessName || "Salão"} • Gestão de clientes, classificação VIP e notas privadas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="brand" className="h-10 rounded-xl px-4 text-xs font-bold shadow-sm">
            <Link href="/schedule">
              <Plus className="mr-1.5 h-4 w-4" />
              Novo Agendamento
            </Link>
          </Button>
        </div>
      </div>

      {/* Search Bar & Filter Pills */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome, email ou telefone (+238)..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs transition-all focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              title="Limpar pesquisa"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTER_PILLS.map(({ value, label, icon: Icon, activeColor, iconFilled }) => {
            const isSelected = selectedTier === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setSelectedTier(value);
                  setPage(0);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shrink-0 transition-all shadow-xs",
                  isSelected
                    ? activeColor
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                {Icon && (
                  <Icon
                    className="h-3.5 w-3.5"
                    style={iconFilled && isSelected ? { fill: "currentColor" } : undefined}
                  />
                )}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
          <div className="hidden lg:block">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <EmptyState
            icon={AlertTriangle}
            tone="error"
            title="Não foi possível carregar a carteira de clientes"
            description="Ocorreu um erro ao comunicar com o servidor. Verifique a sua ligação."
          >
            <Button type="button" variant="brand" onClick={() => void refetch()}>
              Tentar novamente
            </Button>
          </EmptyState>
        </div>
      ) : customers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <EmptyState
            icon={Users}
            title={debouncedSearch || selectedTier !== "ALL" ? "Nenhum cliente encontrado" : "Sem clientes na carteira"}
            description={
              debouncedSearch || selectedTier !== "ALL"
                ? "Tente ajustar o termo de pesquisa ou limpar os filtros de classificação."
                : "Os clientes que realizarem agendamentos no seu salão aparecerão aqui automaticamente."
            }
          >
            {(debouncedSearch || selectedTier !== "ALL") && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTier("ALL");
                  setPage(0);
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </EmptyState>
        </div>
      ) : (
        <>
          {/* Mobile Cards Feed */}
          <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {customers.map((c) => (
              <CustomerListCard
                key={c.customerId}
                customer={c}
                onOpenDetail={handleOpenDetail}
              />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 pl-5 pr-3">Cliente</th>
                    <th className="py-3.5 px-3">Classificação</th>
                    <th className="py-3.5 px-3 text-center">Visitas</th>
                    <th className="py-3.5 px-3">Total Gasto</th>
                    <th className="py-3.5 px-3">Última Visita</th>
                    <th className="py-3.5 px-3">Notas Privadas</th>
                    <th className="py-3.5 pl-3 pr-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c, i) => {
                    const customerId = c.customerId || (c as any)?.id || `cust-${i}`;
                    const name = c.name || (c as any)?.customerName || "Cliente";
                    const phone = c.phone || (c as any)?.customerPhone || "";
                    const email = c.email || (c as any)?.customerEmail || "";
                    const tier = c.tier || (c as any)?.customerTier || "REGULAR";
                    const isVip = tier === "VIP";
                    const completedAppointments =
                      c.completedAppointments ||
                      c.totalAppointments ||
                      (c as any)?.totalBookings ||
                      0;
                    const totalSpentCve =
                      c.totalSpentCve || (c as any)?.totalSpent || 0;
                    const phoneClean = phone ? phone.replace(/\D/g, "") : "";
                    const waPhone = phoneClean.startsWith("238")
                      ? phoneClean
                      : phoneClean
                        ? `238${phoneClean}`
                        : "";

                    return (
                      <tr
                        key={customerId}
                        onClick={() => handleOpenDetail(c)}
                        className={cn(
                          "transition-colors hover:bg-slate-50/70 cursor-pointer group",
                          isVip && "bg-amber-50/20",
                        )}
                      >
                        {/* Name, Avatar & Contact */}
                        <td className="py-3.5 pl-5 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <div className="h-10 w-10 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center text-xs shadow-xs">
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
                                  <User className="h-4 w-4 text-slate-400" />
                                )}
                              </div>
                              {isVip && (
                                <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                                  <Star className="h-2 w-2" style={{ fill: "currentColor" }} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">
                                {name}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {phone ? (phone.startsWith("+") ? phone : `+238 ${phone}`) : "Sem telefone"} {email ? `• ${email}` : ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Tier Badge */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <CustomerTierBadge tier={tier} size="xs" fullLabel={isVip} />
                        </td>

                        {/* Visits */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <span className="font-semibold text-slate-900">
                            {completedAppointments}
                          </span>
                        </td>

                        {/* Total Spent */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="font-bold text-teal-700 font-price">
                            {formatCurrency(totalSpentCve)}
                          </span>
                        </td>

                        {/* Last Visit */}
                        <td className="py-3.5 px-3 whitespace-nowrap text-slate-600">
                          {c.lastAppointmentAt ? (
                            <span>{formatInstantLong(c.lastAppointmentAt)}</span>
                          ) : (
                            <span className="text-slate-400 italic">Sem visitas</span>
                          )}
                        </td>

                        {/* Private Notes */}
                        <td className="py-3.5 px-3 max-w-[220px]">
                          {c.internalNotes ? (
                            <div className="flex items-center gap-1.5 text-slate-600" title={c.internalNotes}>
                              <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                              <span className="truncate italic">{c.internalNotes}</span>
                            </div>
                          ) : (
                            <span className="text-slate-300 italic text-[11px]">Nenhuma</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {waPhone && (
                              <a
                                href={`https://wa.me/${waPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title="WhatsApp"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenDetail(c)}
                              className="h-8 rounded-lg px-2.5 text-xs font-semibold text-slate-700 hover:text-teal-700"
                            >
                              <Eye className="mr-1 h-3.5 w-3.5" />
                              Ver Ficha
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200/80 pt-4 text-xs text-slate-500">
              <span className="font-medium">
                Página {page + 1} de {totalPages} ({totalElements} clientes)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="h-8 rounded-xl px-3 text-xs"
                >
                  <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                  Anterior
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="h-8 rounded-xl px-3 text-xs"
                >
                  Seguinte
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Customer Detail Drawer */}
      <CustomerDetailSheet
        businessId={activeBusinessId || ""}
        customerId={selectedCustomerId}
        initialCustomer={selectedCustomer}
        open={Boolean(selectedCustomerId || selectedCustomer)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCustomerId(null);
            setSelectedCustomer(null);
          }
        }}
      />
    </div>
  );
}
