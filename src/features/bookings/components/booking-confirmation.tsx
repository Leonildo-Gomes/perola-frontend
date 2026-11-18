"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { BookingSuccessView } from "@/components/booking/BookingSuccessView";
import { EmptyState } from "@/components/shared/feedback";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useBookingAppointment, usePublicBusinessProfile } from "../hooks/use-booking";

export function BookingConfirmation({ appointmentId }: { appointmentId: string }) {
  const hydrated = useAuthHydrated();
  const appointment = useBookingAppointment(appointmentId, hydrated);
  const businessId = appointment.data?.businessId;
  const business = usePublicBusinessProfile(businessId as string, Boolean(businessId));

  if (appointment.isError) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-10">
        <EmptyState
          icon={AlertTriangle}
          tone="error"
          title="Não foi possível carregar a marcação"
          description="A sua marcação pode ter sido criada com sucesso. Se já tiver conta, confirme em Minhas Marcações."
        >
          <Button type="button" variant="brand" onClick={() => void appointment.refetch()}>
            Tentar novamente
          </Button>
          <Button asChild variant="outline">
            <Link href="/explore">Explorar serviços</Link>
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

  return (
    <BookingSuccessView
      appointment={a}
      business={business.data}
    />
  );
}
