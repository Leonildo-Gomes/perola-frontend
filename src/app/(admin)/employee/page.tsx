import type { Metadata } from "next";
import { EmployeesContainer } from "@/features/employees/components";

export const metadata: Metadata = {
  title: "Gestão da Equipa & Colaboradores | Painel do Salão Pérola",
  description:
    "Faça a gestão dos profissionais, defina permissões de acesso e atribua serviços especializados às respetivas cadeiras de atendimento em Cabo Verde.",
};

export default function AdminTeamPage() {
  return <EmployeesContainer />;
}

