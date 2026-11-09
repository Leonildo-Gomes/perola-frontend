import type { Metadata } from "next";
import { MyBookingsContainer } from "@/features/customers/components";

export const metadata: Metadata = {
  title: "Minhas Marcações | Pérola",
  description: "Consulte as suas marcações ativas, histórico de atendimentos, reagende ou avalie serviços em Cabo Verde.",
};

export default function MyBookingsPage() {
  return <MyBookingsContainer />;
}

