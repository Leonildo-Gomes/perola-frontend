import type { Metadata } from "next";
import { Suspense } from "react";
import { BusinessSettingsContainer } from "@/features/settings/components";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Definições e Perfil do Salão | Pérola",
  description:
    "Gira os dados institucionais, localização geográfica nas ilhas de Cabo Verde, contactos oficiais e visibilidade pública no Marketplace Pérola.",
};

function SettingsLoadingFallback() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2 pb-4 border-b border-slate-200">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-[480px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<SettingsLoadingFallback />}>
      <BusinessSettingsContainer />
    </Suspense>
  );
}

