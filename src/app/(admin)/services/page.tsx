import type { Metadata } from "next";
import { ServicesContainer } from "@/features/services/components";

export const metadata: Metadata = {
  title: "Catálogo de Serviços | Painel do Salão Pérola",
  description:
    "Gerir tratamentos, durações, preços em CVE e delegação de profissionais habilitados para o seu salão em Cabo Verde.",
};

export default function AdminServicesPage() {
  return <ServicesContainer />;
}

