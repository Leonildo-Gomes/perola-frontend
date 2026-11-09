import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginContainer } from "@/features/auth/components";

export const metadata: Metadata = { title: "Entrar — Pérola" };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContainer />
    </Suspense>
  );
}
