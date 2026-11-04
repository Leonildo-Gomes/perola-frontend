import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterContainer } from "@/components/auth/register-container";

export const metadata: Metadata = { title: "Criar conta — Pérola" };

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContainer />
    </Suspense>
  );
}
