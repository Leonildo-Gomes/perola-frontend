import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizardContainer } from "@/features/bookings/components";

export const metadata: Metadata = {
  title: "Agendar serviço — Pérola",
  description: "Escolha o profissional, a data e o horário e confirme a sua marcação.",
};

export default async function BookPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params;
  return (
    <Suspense>
      <BookingWizardContainer serviceId={serviceId} />
    </Suspense>
  );
}
