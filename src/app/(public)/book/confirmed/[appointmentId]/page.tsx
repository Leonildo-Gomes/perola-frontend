import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingConfirmation } from "@/features/bookings/components";

export const metadata: Metadata = { title: "Marcação registada — Pérola" };

export default async function BookingConfirmedPage({ params }: { params: Promise<{ appointmentId: string }> }) {
  const { appointmentId } = await params;
  return (
    <Suspense>
      <BookingConfirmation appointmentId={appointmentId} />
    </Suspense>
  );
}
