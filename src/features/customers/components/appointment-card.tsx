"use client";

import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Hourglass,
  MapPin,
  MessageCircle,
  Repeat,
  RotateCcw,
  Sparkles,
  Star,
  Store,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { AppointmentStatusBadge } from "./appointment-status-badge";
import { Button } from "@/components/ui/button";
import { formatInstantLong, formatTime } from "@/lib/utils/datetime";
import { formatCurrency, formatDuration } from "@/lib/utils/utils";
import type { CustomerAppointment } from "../types/customer.types";

interface AppointmentCardProps {
  appointment: CustomerAppointment;
  onReschedule: (appointment: CustomerAppointment) => void;
  onCancel: (appointment: CustomerAppointment) => void;
  onReview: (appointment: CustomerAppointment) => void;
}

export function AppointmentCard({
  appointment,
  onReschedule,
  onCancel,
  onReview,
}: AppointmentCardProps) {
  const {
    serviceName,
    servicePrice,
    serviceDuration,
    startTime,
    endTime,
    proposedStartTime,
    status,
    businessName,
    businessCity,
    businessIsland,
    businessAddress,
    businessPhone,
    employeeName,
    employeeRole,
    employeeAvatarUrl,
    review,
  } = appointment;

  const isPending = status === "PENDING";
  const isConfirmed = status === "CONFIRMED";
  const isReschedulePending = status === "RESCHEDULE_PENDING";
  const isCompleted = status === "COMPLETED";
  const isCancelled = status === "CANCELLED";

  // Top accent bar color based on status
  const topAccentColor = isConfirmed
    ? "bg-perola-deep"
    : isPending || isReschedulePending
      ? "bg-amber-400"
      : isCompleted
        ? "bg-slate-300"
        : "bg-rose-300";

  // Google Calendar URL generator
  const calendarUrl = (() => {
    try {
      const start = new Date(startTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
      const end = new Date(endTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
      const title = encodeURIComponent(`${serviceName} - ${businessName ?? "Pérola"}`);
      const details = encodeURIComponent(
        `Marcação de serviço via Pérola CV.\nServiço: ${serviceName}\nProfissional: ${employeeName ?? ""}\nSalão: ${businessName ?? ""}`,
      );
      const location = encodeURIComponent(`${businessAddress ?? ""}, ${businessCity ?? ""}, Cabo Verde`);
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    } catch {
      return null;
    }
  })();

  // WhatsApp link (standard CV prefix +238)
  const phoneClean = (businessPhone ?? "").replace(/\D/g, "");
  const whatsappUrl = phoneClean
    ? `https://wa.me/${phoneClean.startsWith("238") ? phoneClean : `238${phoneClean}`}?text=${encodeURIComponent(
      `Olá! Gostaria de falar sobre a minha marcação de ${serviceName} para o dia ${formatInstantLong(startTime)}.`,
    )}`
    : `https://wa.me/2380000000?text=${encodeURIComponent(`Olá! Gostaria de informações sobre o salão ${businessName}.`)}`;

  const salonInitials = (businessName ?? "Salão")
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <article
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm transition-all duration-200 hover:shadow-md"
      aria-label={`Marcação de ${serviceName} no ${businessName}`}
    >
      {/* Top Accent Color Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${topAccentColor}`} />

      <div className="flex flex-col gap-4 pt-1">
        {/* Card Header: Salon Name, Partner Badge & Status Badge */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-perola-deep">
              {salonInitials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                  {businessName}
                </h2>
                <span title="Parceiro Verificado" className="inline-flex shrink-0">
                  <CheckCircle2
                    className="h-4 w-4 fill-perola-deep text-white"
                    aria-hidden
                  />
                </span>
              </div>
              <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                {[businessAddress, businessCity, businessIsland].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>

          <AppointmentStatusBadge
            status={status}
            hasPendingReschedule={isReschedulePending}
          />
        </div>

        {/* Pending Notice Banner */}
        {isPending && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900">
            <Hourglass className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
            <span>Aguardando confirmação do salão • Resposta média em 30 min.</span>
          </div>
        )}

        {/* Reschedule Pending Notice Banner */}
        {isReschedulePending && proposedStartTime && (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50/80 p-3 text-xs text-amber-900">
            <RotateCcw className="h-4 w-4 shrink-0 text-amber-600 animate-spin-slow" aria-hidden />
            <span>
              Proposta de reagendamento para{" "}
              <strong>
                {formatInstantLong(proposedStartTime)} às {formatTime(proposedStartTime)}
              </strong>{" "}
              enviada. Aguardando confirmação do salão.
            </span>
          </div>
        )}

        {/* Service Details Box */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{serviceName}</h3>
              <span className="inline-flex items-center rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                <Clock className="mr-1 h-3 w-3 text-slate-400" aria-hidden />
                {formatDuration(serviceDuration)}
              </span>
            </div>

            {/* Specialist Details */}
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-perola-mint text-[10px] font-bold text-perola-deep ring-1 ring-slate-200 overflow-hidden">
                {employeeAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={employeeAvatarUrl} alt={employeeName ?? ""} className="h-full w-full object-cover" />
                ) : (
                  (employeeName ?? "P")[0]
                )}
              </div>
              <span className="text-xs text-slate-600">
                Especialista:{" "}
                <strong className="text-slate-900 font-semibold">{employeeName}</strong>
                {employeeRole && ` (${employeeRole})`}
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="md:text-right shrink-0">
            <div className="font-accent text-lg md:text-xl font-extrabold text-slate-900">
              {formatCurrency(servicePrice)}
            </div>
            <span className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-500 mt-0.5">
              Depósito zero • Pagamento no salão
            </span>
          </div>
        </div>

        {/* Meta Data: Date, Time & Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-perola-deep">
              <CalendarDays className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-slate-900 capitalize">
                {formatInstantLong(startTime)}
              </p>
              <p className="text-slate-500">
                Horário: {formatTime(startTime)} – {formatTime(endTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-perola-deep">
              <Store className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Atendimento no salão</p>
              <p className="text-slate-500 truncate max-w-[200px]">
                {businessAddress || `${businessCity}, ${businessIsland}`}
              </p>
            </div>
          </div>
        </div>

        {/* Review submitted snippet (if completed and already evaluated) */}
        {review && (
          <div className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-700 mb-0.5">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-500" : "text-slate-300"
                      }`}
                  />
                ))}
              </div>
              <span>Sua avaliação ({review.rating}/5)</span>
            </div>
            {review.comment && (
              <p className="text-slate-700 italic">&ldquo;{review.comment}&rdquo;</p>
            )}
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Reschedule Button */}
            {(isPending || isConfirmed) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onReschedule(appointment)}
                className="rounded-full text-xs font-semibold hover:border-perola-deep hover:text-perola-deep min-h-[40px]"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                Reagendar
              </Button>
            )}

            {/* Cancel Button */}
            {(isPending || isConfirmed || isReschedulePending) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onCancel(appointment)}
                className="rounded-full text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 min-h-[40px]"
              >
                <XCircle className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                Cancelar
              </Button>
            )}

            {/* Completed: Rebook button */}
            {isCompleted && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full text-xs font-semibold hover:border-perola-deep hover:text-perola-deep min-h-[40px]"
              >
                <Link href={`/book/${appointment.serviceId}?businessId=${appointment.businessId}`}>
                  <Repeat className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  Repetir Marcação
                </Link>
              </Button>
            )}

            {/* Cancelled: Book new */}
            {isCancelled && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full text-xs font-semibold hover:border-perola-deep hover:text-perola-deep min-h-[40px]"
              >
                <Link href={`/book/${appointment.serviceId}?businessId=${appointment.businessId}`}>
                  <CalendarPlus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  Marcar de Novo
                </Link>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* WhatsApp Contact */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-perola-deep transition-colors"
              title="Contactar Salão pelo WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
              <span>Mensagem</span>
            </a>

            {/* Google Calendar Link (Upcoming only) */}
            {(isPending || isConfirmed) && calendarUrl && (
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-perola-deep transition-colors"
                title="Sincronizar no Google Calendar"
              >
                <CalendarPlus className="h-3.5 w-3.5 text-perola-deep" aria-hidden />
                <span className="hidden sm:inline">Calendário</span>
              </a>
            )}

            {/* Review Button (Completed only and not yet reviewed) */}
            {isCompleted && !review && (
              <Button
                type="button"
                variant="brand"
                size="sm"
                onClick={() => onReview(appointment)}
                className="rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white min-h-[40px]"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                ★ Avaliar Atendimento
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
