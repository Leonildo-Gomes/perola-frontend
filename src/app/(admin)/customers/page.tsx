import type { Metadata } from "next";
import { CustomersContainer } from "@/features/customers/components";

export const metadata: Metadata = {
  title: "Carteira de Clientes & CRM | Painel do Salão Pérola",
  description:
    "Gestão da carteira de clientes, classificação VIP e notas internas privadas para salões e profissionais em Cabo Verde.",
};

export default function AdminCustomersPage() {
  return <CustomersContainer />;
}
