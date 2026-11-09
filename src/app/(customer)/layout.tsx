import type { Metadata } from "next";
import {
  PublicBottomNav,
  SiteFooter,
  SiteHeader,
  type SiteHeaderLink,
} from "@/components/shared/navigation";

export const metadata: Metadata = {
  title: "Área do Cliente | Pérola",
  description: "Faça a gestão dos seus agendamentos e histórico de beleza em Cabo Verde.",
};

const CUSTOMER_LINKS: SiteHeaderLink[] = [
  { href: "/explore", label: "Explorar Serviços" },
  { href: "/my-bookings", label: "Minhas Marcações" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader links={CUSTOMER_LINKS} showSearch={true} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <SiteFooter />
      <PublicBottomNav />
    </div>
  );
}

