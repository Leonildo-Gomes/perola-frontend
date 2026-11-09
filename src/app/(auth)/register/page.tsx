import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterContainer } from "@/features/auth/components";

export const metadata: Metadata = { title: "Criar conta — Pérola" };

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContainer />
    </Suspense>
  );
}
