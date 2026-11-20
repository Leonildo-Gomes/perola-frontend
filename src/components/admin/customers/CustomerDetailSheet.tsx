"use client";

import * as React from "react";
import {
  Calendar,
  Check,
  Clock,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Receipt,
  Repeat,
  Sparkles,
  Star,
  StickyNote,
  User,
  UserCheck,
  AlertTriangle,
  History,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  BusinessCustomer,
  BusinessCustomerDetail,
  CustomerTier,
} from "@/features/customers/types/customer.types";
import {
  useBusinessCustomerDetail,
  useUpdateBusinessCustomer,
} from "@/features/customers/hooks/use-business-customers";
import { CustomerTierBadge } from "./CustomerTierBadge";
import { formatCurrency } from "@/lib/utils/utils";
import { formatInstantLong, formatTime } from "@/lib/utils/datetime";
import { cn } from "@/lib/utils/utils";

interface CustomerDetailSheetProps {
  businessId: string;
  customerId: string | null;
  initialCustomer?: BusinessCustomer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function CustomerDetailSheet({
  businessId,
  customerId: propsCustomerId,
  initialCustomer,
  open,
  onOpenChange,
}: CustomerDetailSheetProps) {
  const { data: rawResponse, isLoading, isError } = useBusinessCustomerDetail(
    businessId,
    propsCustomerId,
    open && Boolean(propsCustomerId),
  );

  // Unwrap potential API response envelope ({ data: ... } or { customer: ... } or { result: ... })
  const unwrappedApiData = React.useMemo(() => {
    if (!rawResponse) return null;
    return (
      (rawResponse as any)?.data ??
      (rawResponse as any)?.customer ??
      (rawResponse as any)?.result ??
      rawResponse
    );
  }, [rawResponse]);

  // Merge unwrapped API data with initialCustomer from caller
  const merged = React.useMemo(() => {
    if (!unwrappedApiData && !initialCustomer) return null;
    return {
      ...(initialCustomer || {}),
      ...(unwrappedApiData || {}),
    };
  }, [unwrappedApiData, initialCustomer]);

  // Robust field extraction supporting multiple backend aliases
  const customerId =
    merged?.customerId ||
    (merged as any)?.id ||
    (merged as any)?.customer_id ||
    propsCustomerId ||
    "";

  const name =
    merged?.name ||
    (merged as any)?.customerName ||
    (merged as any)?.fullName ||
    (merged as any)?.customer_name ||
    "";

  const phone =
    merged?.phone ||
    (merged as any)?.customerPhone ||
    (merged as any)?.phoneNumber ||
    (merged as any)?.phone_number ||
    (merged as any)?.mobile ||
    "";

  const email =
    merged?.email ||
    (merged as any)?.customerEmail ||
    (merged as any)?.customer_email ||
    "";

  const defaultTier: CustomerTier =
    (merged?.tier || (merged as any)?.customerTier || "REGULAR") as CustomerTier;

  const defaultNotes: string =
    merged?.internalNotes ??
    (merged as any)?.notes ??
    (merged as any)?.internal_notes ??
    "";

  const totalAppointments = Number(
    merged?.totalAppointments ??
    (merged as any)?.total_appointments ??
    (merged as any)?.totalBookings ??
    (merged as any)?.appointmentsCount ??
    0,
  );

  const completedAppointments = Number(
    merged?.completedAppointments ??
    (merged as any)?.completed_appointments ??
    (merged as any)?.completedBookings ??
    0,
  );

  const cancelledAppointments = Number(
    merged?.cancelledAppointments ??
    (merged as any)?.cancelled_appointments ??
    (merged as any)?.cancelledBookings ??
    0,
  );

  const totalSpentCve = Number(
    merged?.totalSpentCve ??
    (merged as any)?.total_spent_cve ??
    (merged as any)?.totalSpent ??
    (merged as any)?.total_spent ??
    0,
  );

  const hasRegisteredAccount = Boolean(
    merged?.hasRegisteredAccount ??
    (merged as any)?.has_registered_account ??
    (merged as any)?.userId ??
    (merged as any)?.user_id,
  );

  const recentAppointments: any[] = React.useMemo(() => {
    const list =
      merged?.recentAppointments ??
      (merged as any)?.recent_appointments ??
      (merged as any)?.appointments ??
      (merged as any)?.history;
    return Array.isArray(list) ? list : [];
  }, [merged]);

  const [tier, setTier] = React.useState<CustomerTier>("REGULAR");
  const [internalNotes, setInternalNotes] = React.useState<string>("");

  const updateMutation = useUpdateBusinessCustomer();

  // Sync internal state when customer data arrives or changes
  React.useEffect(() => {
    if (merged) {
      setTier(defaultTier);
      setInternalNotes(defaultNotes);
    }
  }, [customerId, defaultTier, defaultNotes, merged]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveCustomerId = customerId || propsCustomerId;
    if (!businessId || !effectiveCustomerId) return;

    await updateMutation.mutateAsync({
      businessId,
      customerId: effectiveCustomerId,
      payload: {
        tier,
        internalNotes: internalNotes.trim() || null,
      },
    });
  };

  const phoneClean = phone ? phone.replace(/\D/g, "") : "";
  const waPhone = phoneClean.startsWith("238")
    ? phoneClean
    : phoneClean
    ? `238${phoneClean}`
    : "";

  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "";

  const hasData = Boolean(name || phone || email || merged);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full bg-white overflow-hidden"
      >
        <SheetHeader className="p-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-teal-50 border-2 border-teal-600/30 text-teal-800 font-bold flex items-center justify-center text-base shadow-xs">
                  {initials ? (
                    initials
                  ) : (
                    <User className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                {tier === "VIP" && (
                  <span
                    className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs"
                    title="Cliente VIP"
                  >
                    <Star className="h-3 w-3" style={{ fill: "currentColor" }} />
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-lg font-bold text-slate-900 truncate">
                  {name || "Detalhes do Cliente"}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-0.5">
                  <CustomerTierBadge tier={tier} size="xs" />
                  <span className="text-[11px] text-slate-500 font-medium">
                    {hasRegisteredAccount ? "Conta Registada" : "Visitante Sem Conta"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>

        {isLoading && !hasData ? (
          <div className="p-5 space-y-4">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : isError && !hasData ? (
          <div className="p-6 text-center text-slate-500 text-sm">
            Não foi possível carregar a ficha deste cliente.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Quick Contact & WhatsApp Action Bar */}
            <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {phone ? (phone.startsWith("+") ? phone : `+238 ${phone}`) : "Sem telefone"}
                </p>
                {email && (
                  <p className="text-[11px] text-slate-500 truncate">
                    {email}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {waPhone && (
                  <>
                    <a
                      href={`tel:+${waPhone}`}
                      className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-teal-700 transition-colors shadow-xs"
                      title="Ligar"
                    >
                      <Phone className="mr-1 h-3.5 w-3.5" />
                      Ligar
                    </a>
                    <a
                      href={`https://wa.me/${waPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center justify-center rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 px-2.5 text-xs font-semibold text-[#128C7E] hover:bg-[#25D366]/25 transition-colors shadow-xs"
                      title="Abrir WhatsApp"
                    >
                      <MessageCircle className="mr-1 h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 bg-teal-50/50 border border-teal-100 p-3 rounded-2xl text-center">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                  Visitas
                </span>
                <span className="text-base font-bold text-slate-900">
                  {completedAppointments || totalAppointments || 0}
                </span>
              </div>
              <div className="border-x border-teal-200/50">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                  Total Gasto
                </span>
                <span className="text-base font-bold text-teal-700 font-price">
                  {formatCurrency(totalSpentCve || 0)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                  Cancelamentos
                </span>
                <span className="text-base font-bold text-rose-700">
                  {cancelledAppointments || 0}
                </span>
              </div>
            </div>

            {/* Classification & Notes Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-2">
                  Classificação de Fidelidade no Salão
                </label>
                <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-xl">
                  {TIERS.map(({ value, label, icon: Icon, activeClass, iconFilled }) => {
                    const isSelected = tier === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTier(value)}
                        className={cn(
                          "py-2 rounded-lg text-xs font-medium text-center transition-all flex flex-col items-center justify-center gap-1",
                          isSelected
                            ? activeClass
                            : "text-slate-600 hover:bg-white hover:text-slate-900",
                        )}
                      >
                        <Icon
                          className="h-3.5 w-3.5"
                          style={
                            iconFilled && isSelected
                              ? { fill: "currentColor" }
                              : undefined
                          }
                        />
                        <span className="text-[10px]">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* VIP Notice Banner */}
              {tier === "VIP" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                  <Star
                    className="h-4 w-4 text-amber-600 shrink-0 mt-0.5"
                    style={{ fill: "currentColor" }}
                  />
                  <p className="text-xs text-amber-900 leading-relaxed">
                    A classificação VIP concede prioridade máxima na marcação online e mimos de boas-vindas exclusivos no salão.
                  </p>
                </div>
              )}

              {/* Private Notes Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="customer-internal-notes"
                    className="text-xs font-semibold text-slate-900 flex items-center gap-1.5"
                  >
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    Notas Privadas da Equipa
                  </label>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                    Exclusivo do Salão
                  </span>
                </div>
                <textarea
                  id="customer-internal-notes"
                  rows={3}
                  maxLength={500}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Observações internas sobre o cliente (ex: alergias, corte favorito, bebida preferida)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none leading-relaxed"
                />
              </div>

              <Button
                type="submit"
                variant="brand"
                disabled={updateMutation.isPending}
                className="w-full h-11 rounded-xl text-xs font-bold shadow-md"
              >
                <Check className="mr-1.5 h-4 w-4" />
                {updateMutation.isPending ? "A guardar..." : "Guardar Classificação e Notas"}
              </Button>
            </form>

            {/* Appointment History */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <History className="h-4 w-4 text-slate-400" />
                Histórico no Salão ({recentAppointments.length})
              </h4>

              {recentAppointments.length > 0 ? (
                <div className="space-y-2.5">
                  {recentAppointments.map((appt: any, idx: number) => {
                    const apptId = appt.id || `appt-${idx}`;
                    const serviceName = appt.serviceName || appt.service_name || "Serviço";
                    const employeeName = appt.employeeName || appt.employee_name || appt.staffName || "Especialista";
                    const price = appt.servicePrice ?? appt.service_price ?? appt.price ?? 0;
                    const startTime = appt.startTime || appt.start_time || appt.date || "";
                    const status = appt.status || "CONFIRMED";

                    return (
                      <div
                        key={apptId}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-slate-900">
                              {serviceName}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              com {employeeName}
                            </p>
                          </div>
                          <span className="font-bold text-teal-700 font-price">
                            {formatCurrency(price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {startTime ? `${formatInstantLong(startTime)} às ${formatTime(startTime)}` : "Data a definir"}
                          </span>
                          <span className="capitalize font-medium text-slate-700">
                            {typeof status === "string" ? status.toLowerCase() : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Sem outras marcações registradas para este cliente.
                </p>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
