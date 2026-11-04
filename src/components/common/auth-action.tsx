"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

export function AuthAction() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const name = useAuthStore((s) => s.user?.name);
  return isAuthenticated ? (
    <Button asChild variant="brand" className="rounded-full px-5">
      <Link href="/my-bookings" aria-label="A minha conta">
        <User className="mr-2 h-4 w-4" aria-hidden />
        {name?.split(" ")[0] ?? "Conta"}
      </Link>
    </Button>
  ) : (
    <Button asChild variant="brand" className="rounded-full px-5">
      <Link href="/login">
        <User className="mr-2 h-4 w-4" aria-hidden />
        Entrar
      </Link>
    </Button>
  );
}
