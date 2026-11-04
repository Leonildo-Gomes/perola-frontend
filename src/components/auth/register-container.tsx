"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/lib/api/auth";
import { isApiError } from "@/lib/api/client";
import { resolvePostAuthRoute } from "@/lib/auth-redirect";
import type { RegisterFormValues } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";
import type { AuthResponse } from "@/types/auth";
import { AuthCard } from "./auth-card";
import { AuthDivider } from "./auth-divider";
import { authErrorMessage } from "./auth-error";
import { RegisterForm } from "./register-form";
import { SocialAuthButton } from "./social-auth-button";

export function RegisterContainer() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailConflict, setEmailConflict] = useState(false);
  const returnUrl = params.get("next") ?? params.get("returnUrl");

  const handleSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    setEmailConflict(false);
    try {
      const res = await authApi.register({
        name: values.name,
        email: values.email,
        phone: `+238${values.phone}`,
        password: values.password,
      });
      // Automatic login after registration, then route by intent.
      login(res, true);
      router.replace(
        values.intent === "BUSINESS_OWNER"
          ? "/onboarding"
          : resolvePostAuthRoute(res.user, returnUrl),
      );
    } catch (e) {
      if (isApiError(e) && e.status === 409) setEmailConflict(true);
      else setError(authErrorMessage(e, "register"));
      setLoading(false);
    }
  };

  const handleGoogle = async (idToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const res: AuthResponse = await authApi.google(idToken);
      login(res, true);
      router.replace(resolvePostAuthRoute(res.user, returnUrl));
    } catch (e) {
      setError(authErrorMessage(e, "register"));
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Criar a sua conta no Pérola"
      description="Junte-se à maior plataforma de beleza e bem-estar de Cabo Verde"
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-teal-700 hover:underline">
            Inicie sessão
          </Link>
        </>
      }
    >
      <SocialAuthButton mode="register" disabled={isLoading} onCredential={handleGoogle} />
      <AuthDivider>ou preencha os seus dados</AuthDivider>
      <RegisterForm isLoading={isLoading} serverError={error} emailConflict={emailConflict} onSubmit={handleSubmit} />
    </AuthCard>
  );
}
