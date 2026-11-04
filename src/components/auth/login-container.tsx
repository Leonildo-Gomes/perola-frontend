"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/lib/api/auth";
import { resolvePostAuthRoute } from "@/lib/auth-redirect";
import { useAuthStore } from "@/stores/auth-store";
import type { AuthResponse } from "@/types/auth";
import type { LoginFormValues } from "@/lib/validations/auth";
import { AuthCard } from "./auth-card";
import { authErrorMessage } from "./auth-error";
import { AuthDivider } from "./auth-divider";
import { LoginForm } from "./login-form";
import { SocialAuthButton } from "./social-auth-button";
import Link from "next/link";

export function LoginContainer() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const returnUrl = params.get("next") ?? params.get("returnUrl");

  const complete = (res: AuthResponse, remember: boolean) => {
    login(res, remember);
    router.replace(resolvePostAuthRoute(res.user, returnUrl));
  };

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login({ email: values.email, password: values.password });
      complete(res, values.rememberMe ?? true);
    } catch (e) {
      setError(authErrorMessage(e, "login"));
      setLoading(false);
    }
  };

  const handleGoogle = async (idToken: string) => {
    setLoading(true);
    setError(null);
    try {
      complete(await authApi.google(idToken), true);
    } catch (e) {
      setError(authErrorMessage(e, "login"));
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Bem-vindo(a) de volta"
      description="Entre para gerir as suas marcações."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link href={returnUrl ? `/register?next=${encodeURIComponent(returnUrl)}` : "/register"} className="font-semibold text-teal-600 hover:underline">
            Crie uma conta gratuita
          </Link>
        </>
      }
    >
      <SocialAuthButton mode="login" disabled={isLoading} onCredential={handleGoogle} />
      <AuthDivider />
      <LoginForm isLoading={isLoading} serverError={error} onSubmit={handleSubmit} />
    </AuthCard>
  );
}
