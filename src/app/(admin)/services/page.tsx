import type { Metadata } from "next";
import { ServicesContainer } from "@/components/admin/services/services-container";

export const metadata: Metadata = {
  title: "Catálogo de Serviços | Painel do Salão Pérola",
  description:
    "Gerir tratamentos, durações, preços em CVE e delegação de profissionais habilitados para o seu salão em Cabo Verde.",
};

export default function AdminServicesPage() {
  return <ServicesContainer />;
}

