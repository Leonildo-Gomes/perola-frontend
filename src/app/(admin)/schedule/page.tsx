import type { Metadata } from "next";
import { Suspense } from "react";
import { ScheduleContainer } from "@/components/admin/schedule/schedule-container";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Agenda Operacional do Salão | Pérola",
  description:
    "Linha do tempo diária de atendimentos, aprovação manual de pendentes, conclusão de serviços e acompanhamento em tempo real para salões em Cabo Verde.",
};

function ScheduleLoadingFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      <Skeleton className="h-[600px] w-full rounded-2xl" />
    </div>
  );
}

export default function AdminSchedulePage() {
  return (
    <Suspense fallback={<ScheduleLoadingFallback />}>
      <ScheduleContainer />
    </Suspense>
  );
}

