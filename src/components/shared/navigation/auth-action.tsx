"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { ProfileSwitcher } from "./profile-switcher";

export function AuthAction() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <ProfileSwitcher variant="public" />;
  }

  return (
    <Button asChild variant="brand" className="rounded-full px-5">
      <Link href="/login">
        <User className="mr-2 h-4 w-4" aria-hidden />
        Entrar
      </Link>
    </Button>
  );
}
