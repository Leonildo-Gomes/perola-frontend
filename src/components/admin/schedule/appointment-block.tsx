"use client";

import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  MessageCircle,
  MoreVertical,
  Phone,
  Sparkles,
  User,
  X,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTime } from "@/lib/datetime";
import { cn, formatCurrency, formatDuration } from "@/lib/utils";
import type { SalonAppointment } from "@/types/appointments";

interface AppointmentBlockProps {
  appointment: SalonAppointment;
  onConfirm?: (appointment: SalonAppointment) => void;
  onComplete?: (appointment: SalonAppointment) => void;
  onCancel?: (appointment: SalonAppointment) => void;
  onAcceptReschedule?: (appointment: SalonAppointment) => void;
  onRejectReschedule?: (appointment: SalonAppointment) => void;
  isPendingAction?: boolean;
  className?: string;
}

export function AppointmentBlock({
  appointment,
  onConfirm,
  onComplete,
  onCancel,
  onAcceptReschedule,
  onRejectReschedule,
  isPendingAction = false,
  className,
}: AppointmentBlockProps) {
  const startTimeFormatted = formatTime(appointment.startTime);
  const endTimeFormatted = formatTime(appointment.endTime);
  const timeRange = `${startTimeFormatted} - ${endTimeFormatted}`;
  const phoneClean = appointment.customerPhone?.replace(/\D/g, "") || "";

  // 1. PENDING (Awaiting Salon Approval)
  if (appointment.status === "PENDING") {
    return (
      <div
        className={cn(
          "rounded-2xl border-2 border-amber-300 bg-amber-50/95 p-3.5 shadow-sm transition-all hover:shadow-md",
          className,
        )}
      >
        <div className="flex flex-col gap-2">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                PENDENTE
              </span>
              <span className="text-xs font-semibold text-amber-900">
                {timeRange}
              </span>
              {appointment.chairName && (
                <span className="rounded bg-white/70 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-200">
                  {appointment.chairName}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-amber-950 font-price shrink-0">
              {formatCurrency(appointment.servicePrice)}
            </span>
          </div>

          {/* Client & Service */}
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-sm truncate">
              {appointment.customerName}
            </h4>
            <p className="text-xs text-amber-800 truncate">
              {appointment.serviceName} ({formatDuration(appointment.serviceDuration)})
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between border-t border-amber-200/80 pt-2.5 mt-0.5">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              {phoneClean && (
                <>
                  <a
                    href={`tel:+238${phoneClean}`}
                    className="p-1 rounded-lg text-slate-700 hover:bg-amber-100 hover:text-teal-700 transition-colors"
                    title="Ligar"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/238${phoneClean}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </a>
                  <span className="text-[11px] font-medium text-slate-600">
                    +238 {appointment.customerPhone}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                size="sm"
                variant="brand"
                disabled={isPendingAction}
                onClick={() => onConfirm?.(appointment)}
                className="h-8 rounded-lg px-2.5 text-xs font-semibold"
              >
                <Check className="mr-1 h-3.5 w-3.5 stroke-[2.5]" />
                Aceitar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPendingAction}
                onClick={() => onCancel?.(appointment)}
                className="h-8 rounded-lg px-2 text-xs font-semibold text-rose-700 border-rose-200 hover:bg-rose-50"
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Recusar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. RESCHEDULE_PENDING
  if (appointment.status === "RESCHEDULE_PENDING") {
    const proposedTime = appointment.proposedStartTime
      ? formatTime(appointment.proposedStartTime)
      : null;

    return (
      <div
        className={cn(
          "rounded-2xl border-2 border-indigo-200 bg-indigo-50/90 p-3.5 shadow-sm transition-all hover:shadow-md",
          className,
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-100 px-2 py-0.5 text-[11px] font-bold text-indigo-900">
              <Clock className="h-3 w-3" />
              NOVO HORÁRIO PROPOSTO
            </span>
            <span className="text-xs font-bold text-indigo-950 font-price">
              {formatCurrency(appointment.servicePrice)}
            </span>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm truncate">
              {appointment.customerName}
            </h4>
            <p className="text-xs text-indigo-800">
              Proposta: <strong>{proposedTime || "Novo horário"}</strong> (Horário anterior: {startTimeFormatted})
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-indigo-200/80 pt-2.5 mt-0.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPendingAction}
              onClick={() => onRejectReschedule?.(appointment)}
              className="h-8 rounded-lg px-2.5 text-xs text-slate-700 border-slate-200"
            >
              Recusar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="brand"
              disabled={isPendingAction}
              onClick={() => onAcceptReschedule?.(appointment)}
              className="h-8 rounded-lg px-3 text-xs"
            >
              <Check className="mr-1 h-3.5 w-3.5" />
              Aceitar Proposta
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. CONFIRMED
  if (appointment.status === "CONFIRMED") {
    return (
      <div
        className={cn(
          "rounded-2xl border-2 border-teal-600/30 bg-white p-3.5 shadow-sm transition-all hover:border-teal-600 hover:shadow-md",
          className,
        )}
      >
        <div className="flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-800 border border-teal-200">
                Confirmado
              </span>
              <span className="text-xs font-bold text-slate-800">
                {timeRange}
              </span>
              {appointment.chairName && (
                <span className="rounded bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">
                  {appointment.chairName}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-teal-700 font-price shrink-0">
              {formatCurrency(appointment.servicePrice)}
            </span>
          </div>

          {/* Client & Service */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm truncate">
              {appointment.customerName}
            </h4>
            <p className="text-xs text-slate-500 truncate">
              {appointment.serviceName} • {formatDuration(appointment.serviceDuration)}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-0.5">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              {phoneClean && (
                <>
                  <a
                    href={`tel:+238${phoneClean}`}
                    className="p-1 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                    title="Ligar para cliente"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/238${phoneClean}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </a>
                  <span className="text-[11px] font-medium text-slate-600">
                    +238 {appointment.customerPhone}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                size="sm"
                variant="brand"
                disabled={isPendingAction}
                onClick={() => onComplete?.(appointment)}
                className="h-8 rounded-lg px-2.5 text-xs font-semibold shadow-xs"
              >
                <Check className="mr-1 h-3.5 w-3.5 stroke-[2.5]" />
                Concluir
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                    <span className="sr-only">Opções</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                  <DropdownMenuItem
                    onClick={() => onCancel?.(appointment)}
                    className="text-xs font-medium text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    <XCircle className="mr-2 h-3.5 w-3.5" />
                    Cancelar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. COMPLETED
  if (appointment.status === "COMPLETED") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-slate-200 bg-slate-50/80 p-3 shadow-xs transition-opacity hover:opacity-100",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              <CheckCircle2 className="h-3 w-3" />
              Concluído
            </span>
            <span className="font-bold text-slate-800 text-xs truncate">
              {appointment.customerName}
            </span>
            <span className="text-[11px] text-slate-500 truncate hidden sm:inline">
              • {appointment.serviceName}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-semibold text-slate-900 font-price">
              {formatCurrency(appointment.servicePrice)}
            </span>
            <span className="text-[10px] text-slate-400 block">{timeRange}</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. CANCELLED
  return (
    <div
      className={cn(
        "rounded-2xl border border-rose-200 bg-rose-50/50 p-3 text-xs opacity-60",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
            Cancelado
          </span>
          <span className="font-medium text-slate-700 truncate line-through">
            {appointment.customerName} ({appointment.serviceName})
          </span>
        </div>
        <span className="text-slate-400 text-[11px]">{timeRange}</span>
      </div>
    </div>
  );
}

