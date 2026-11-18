"use client";

import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  Compass,
  MapPin,
  Sparkles,
  Store,
  User,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { AppointmentStatusBadge } from "@/features/customers/components";
import { Button } from "@/components/ui/button";
import type { AppointmentResponse, PublicBusinessProfile } from "@/features/bookings/types/booking.types";
import { formatInstantLong, formatTime } from "@/lib/utils/datetime";
import { formatCurrency, formatDuration } from "@/lib/utils/utils";
import { useAuthStore } from "@/stores/auth-store";

interface BookingSuccessViewProps {
  appointment: AppointmentResponse;
  business?: PublicBusinessProfile | null;
  employeeName?: string | null;
}

export function BookingSuccessView({
  appointment: a,
  business: b,
  employeeName,
}: BookingSuccessViewProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const customerName = a.customerName || "";
  const customerEmail = a.customerEmail || "";
  const customerPhone = a.customerPhone || "";
  const resolvedEmployeeName = employeeName || a.employeeName || "Profissional do Salão";
  const resolvedBusinessName = b?.name || a.businessName || "Salão de Beleza";
  const resolvedAddress = [b?.location, b?.city, b?.island].filter(Boolean).join(", ");

  const registerHref = `/register?email=${encodeURIComponent(customerEmail)}&name=${encodeURIComponent(customerName)}&phone=${encodeURIComponent(customerPhone)}&next=${encodeURIComponent("/my-bookings")}`;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      {/* Header with Success Icon */}
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600 ring-8 ring-teal-50/50 shadow-sm">
          <CalendarCheck className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900">
          Marcação registada!
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          {a.status === "PENDING"
            ? "O salão vai confirmar a sua marcação em breve."
            : "A sua marcação está confirmada com sucesso."}
        </p>
      </div>

      {/* Main Appointment Card */}
      <section
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
        aria-label="Detalhes da marcação"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Serviço
            </span>
            <h2 className="text-lg font-bold text-slate-900">{a.serviceName}</h2>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
              <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden />
              {formatDuration(a.serviceDuration)}
            </div>
          </div>
          <AppointmentStatusBadge status={a.status} />
        </div>

        {/* Salon & Professional */}
        <div className="grid gap-3 py-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <Store className="h-3.5 w-3.5" aria-hidden /> Salão
            </span>
            <p className="mt-1 font-semibold text-slate-900">{resolvedBusinessName}</p>
            {resolvedAddress && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                {resolvedAddress}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <UserCheck className="h-3.5 w-3.5" aria-hidden /> Especialista
            </span>
            <p className="mt-1 font-semibold text-slate-900">{resolvedEmployeeName}</p>
            <p className="mt-0.5 text-xs text-slate-500">Atendimento presencial</p>
          </div>
        </div>

        {/* Date & Time Capsule */}
        <div className="rounded-xl bg-teal-50/70 p-3.5 flex items-center justify-between gap-3 border border-teal-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Data e Hora Marcada
            </span>
            <p className="mt-0.5 text-sm sm:text-base font-bold text-slate-900 capitalize">
              {formatInstantLong(a.startTime)}
            </p>
            <p className="text-xs text-teal-900">
              às <span className="font-bold">{formatTime(a.startTime)}</span> (Horário de Cabo Verde)
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 shadow-xs">
            <CalendarCheck className="h-5 w-5" aria-hidden />
          </span>
        </div>

        {/* Contact info registered */}
        {(customerName || customerEmail || customerPhone) && (
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs text-slate-600 space-y-1">
            <span className="font-semibold text-slate-700">Dados do Contacto:</span>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {customerName && <span>Nome: <strong className="text-slate-900">{customerName}</strong></span>}
              {customerEmail && <span>Email: <strong className="text-slate-900">{customerEmail}</strong></span>}
              {customerPhone && <span>Telefone: <strong className="text-slate-900">{customerPhone}</strong></span>}
            </div>
            {a.notes && (
              <p className="pt-1 text-slate-500 italic">
                &ldquo;{a.notes}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Total Price & Payment Method */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase">
                Total a Pagar no Salão
              </span>
              <p className="text-xs text-teal-700 font-medium">
                Sem taxas de reserva online
              </p>
            </div>
            <span className="font-accent text-2xl font-extrabold text-slate-900">
              {formatCurrency(a.servicePrice)}
            </span>
          </div>
          <div className="mt-2.5 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
            Pagamento presencial no salão em dinheiro, Vinti4 ou transferência móvel no final do serviço.
          </div>
        </div>
      </section>

      {/* Guest Account Creation Callout */}
      {!isAuthenticated && customerEmail && (
        <section
          aria-label="Convite para criar conta"
          className="mt-6 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/80 to-teal-50/50 p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-900">
                Acompanhe o seu agendamento no Pérola
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Crie uma conta gratuita com os seus dados já pré-preenchidos para gerir, reagendar ou cancelar esta marcação facilmente a qualquer momento.
              </p>
              <div className="mt-3.5">
                <Button asChild variant="brand" className="w-full sm:w-auto">
                  <Link href={registerHref} className="inline-flex items-center gap-2">
                    Criar Conta com estes dados
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {isAuthenticated ? (
          <Button asChild variant="brand" size="lg" className="flex-1">
            <Link href="/my-bookings">Ver Minhas Marcações</Link>
          </Button>
        ) : (
          <Button asChild variant="brand" size="lg" className="flex-1">
            <Link href="/explore">
              <Compass className="mr-2 h-4 w-4" aria-hidden />
              Explorar Mais Serviços
            </Link>
          </Button>
        )}
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href="/">Voltar ao Início</Link>
        </Button>
      </div>
    </div>
  );
}
