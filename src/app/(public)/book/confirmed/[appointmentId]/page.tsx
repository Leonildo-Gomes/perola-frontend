import type { Metadata } from "next";
import { BookingConfirmation } from "@/features/bookings/components";

export const metadata: Metadata = { title: "Marcação registada — Pérola" };

export default async function BookingConfirmedPage({ params }: { params: Promise<{ appointmentId: string }> }) {
  const { appointmentId } = await params;
  return <BookingConfirmation appointmentId={appointmentId} />;
}
