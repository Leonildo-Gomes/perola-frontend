import type { Metadata } from "next";
import { Suspense } from "react";
import { AvailabilityContainer } from "@/features/availabilities/components";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Disponibilidade & Expediente Semanal | Pérola",
  description:
    "Gestão de abertura mensal mandatória, expediente de trabalho semanal de 7 dias, intervalos de almoço e decisões de feriados de Cabo Verde.",
};

function AvailabilityLoadingFallback() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>
      <Skeleton className="h-10 w-80 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-56 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function AdminAvailabilityPage() {
  return (
    <Suspense fallback={<AvailabilityLoadingFallback />}>
      <AvailabilityContainer />
    </Suspense>
  );
}

