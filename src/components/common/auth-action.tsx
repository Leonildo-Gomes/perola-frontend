"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

export function AuthAction() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const name = useAuthStore((s) => s.user?.name);
  return isAuthenticated ? (
    <Button asChild variant="secondary" className="px-3">
      <Link href="/my-bookings" aria-label="As minhas marcações">
        {name?.split(" ")[0] ?? "Conta"}
      </Link>
    </Button>
  ) : (
    <Button asChild className="px-4">
      <Link href="/login">Entrar</Link>
    </Button>
  );
}
