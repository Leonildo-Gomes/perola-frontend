"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { AuthAlert } from "./auth-alert";
import { Field } from "./field";
import { IconInput } from "./icon-input";
import { PasswordInput } from "./password-input";

export interface LoginFormProps {
  isLoading: boolean;
  serverError?: string | null;
  onSubmit: (values: LoginFormValues) => Promise<void>;
  onForgotPasswordClick?: () => void;
}

export function LoginForm({ isLoading, serverError, onSubmit, onForgotPasswordClick }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {serverError && <AuthAlert>{serverError}</AuthAlert>}
      <Field id="email" label="Email" error={errors.email?.message}>
        <IconInput
          icon={Mail}
          id="email"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="ex: maria.santos@email.cv"
          disabled={isLoading}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
      </Field>
      <Field id="password" label="Palavra-passe" error={errors.password?.message}>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={isLoading}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
      </Field>
      <div className="flex items-center justify-between gap-2">
        <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-slate-500">
          <input type="checkbox" className="h-5 w-5 rounded accent-perola-deep" disabled={isLoading} {...register("rememberMe")} />
          Manter sessão iniciada
        </label>
        {onForgotPasswordClick && (
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className="min-h-[44px] text-sm font-semibold text-perola-deep hover:underline"
          >
            Esqueceu a palavra-passe?
          </button>
        )}
      </div>
      <Button type="submit" variant="brand" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />A iniciar sessão...
          </>
        ) : (
          <>
            Entrar
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </>
        )}
      </Button>
    </form>
  );
}
