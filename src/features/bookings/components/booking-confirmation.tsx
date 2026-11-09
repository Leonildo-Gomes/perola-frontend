"use client";

import { AlertTriangle, CalendarCheck, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppointmentStatusBadge } from "@/components/appointments/appointment-status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { formatInstantLong, formatTime } from "@/lib/datetime";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useBookingAppointment, usePublicBusinessProfile } from "../hooks/use-booking";

export function BookingConfirmation({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace(`/login?next=${encodeURIComponent(`/book/confirmed/${appointmentId}`)}`);
  }, [hydrated, isAuthenticated, router, appointmentId]);

  const appointment = useBookingAppointment(appointmentId, hydrated && isAuthenticated);
  const businessId = appointment.data?.businessId;
  const business = usePublicBusinessProfile(businessId as string, Boolean(businessId));

  if (appointment.isError) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-10">
        <EmptyState icon={AlertTriangle} tone="error" title="Não foi possível carregar a marcação" description="A sua marcação pode ter sido criada. Confirme em Minhas Marcações.">
          <Button type="button" variant="brand" onClick={() => void appointment.refetch()}>
            Tentar novamente
          </Button>
          <Button asChild variant="outline">
            <Link href="/my-bookings">Minhas Marcações</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  const a = appointment.data;
  if (!a) {
    return (
      <div className="mx-auto w-full max-w-xl space-y-4 px-4 py-10" aria-busy="true" aria-label="A carregar">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="h-8 w-2/3 self-center" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    );
  }

  const b = business.data;
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-perola-mint text-perola-deep">
          <CalendarCheck className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Marcação registada!</h1>
        <p className="mt-1 text-sm text-slate-500">
          {a.status === "PENDING" ? "O salão vai confirmar a sua marcação em breve." : "A sua marcação está confirmada."}
        </p>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Detalhes da marcação">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">{a.serviceName}</h2>
          <AppointmentStatusBadge status={a.status} />
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          {b && (
            <div>
              <dt className="text-xs text-slate-500">Salão</dt>
              <dd className="font-semibold text-slate-900">
                {b.name} · {[b.location, b.city].filter(Boolean).join(", ")}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-slate-500">Data e hora</dt>
            <dd className="font-semibold text-slate-900">
              {formatInstantLong(a.startTime)} às {formatTime(a.startTime)}
            </dd>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {formatDuration(a.serviceDuration)}
          </div>
        </dl>
        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500">A pagar no local</span>
          <span className="font-accent text-2xl font-extrabold text-slate-900">{formatCurrency(a.servicePrice)}</span>
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="brand" className="flex-1">
          <Link href="/my-bookings">Ver Minhas Marcações</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/explore">Explorar mais serviços</Link>
        </Button>
      </div>
    </div>
  );
}
