"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CalendarCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { registerSchema, type RegisterFormValues, type UserIntent } from "@/lib/validations/auth";
import { AuthAlert } from "./auth-alert";
import { Field } from "./field";
import { PasswordInput } from "./password-input";
import { PasswordStrength } from "./password-strength";
import { PhoneInputCV } from "./phone-input-cv";

export interface RegisterFormProps {
  isLoading: boolean;
  /** Generic server error (non-conflict). */
  serverError?: string | null;
  /** 409: email already registered. */
  emailConflict?: boolean;
  onSubmit: (values: RegisterFormValues) => Promise<void>;
}

const INTENTS: { value: UserIntent; label: string; icon: typeof CalendarCheck }[] = [
  { value: "CUSTOMER", label: "Quero agendar serviços", icon: CalendarCheck },
  { value: "BUSINESS_OWNER", label: "Quero registar o meu salão", icon: Building2 },
];

export function RegisterForm({ isLoading, serverError, emailConflict, onSubmit }: RegisterFormProps) {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { intent: "CUSTOMER", name: "", email: "", phone: "", password: "", terms: false as unknown as true },
  });
  const password = watch("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {emailConflict && (
        <AuthAlert>
          Já existe uma conta associada a este email.{" "}
          <Link href="/login" className="font-semibold underline">
            Pretende iniciar sessão?
          </Link>
        </AuthAlert>
      )}
      {serverError && <AuthAlert>{serverError}</AuthAlert>}

      <Controller
        control={control}
        name="intent"
        render={({ field }) => (
          <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-2" disabled={isLoading}>
            <legend className="sr-only">O que pretende fazer?</legend>
            {INTENTS.map(({ value, label, icon: Icon }) => {
              const selected = field.value === value;
              return (
                <label
                  key={value}
                  className={cn(
                    "flex min-h-[56px] cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors",
                    selected ? "border-teal-600 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-700 hover:bg-slate-50",
                  )}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={field.name}
                    value={value}
                    checked={selected}
                    onChange={() => field.onChange(value)}
                  />
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  {label}
                </label>
              );
            })}
          </fieldset>
        )}
      />

      <Field id="name" label="Nome completo" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          placeholder="ex: Carlos Semedo"
          disabled={isLoading}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
      </Field>
      <Field id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="ex: maria.santos@email.cv"
          disabled={isLoading}
          aria-invalid={!!errors.email || emailConflict}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
      </Field>
      <Field id="phone" label="Telemóvel" error={errors.phone?.message}>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneInputCV
              id="phone"
              ref={field.ref}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isLoading}
              invalid={!!errors.phone}
              describedBy={errors.phone ? "phone-error" : undefined}
            />
          )}
        />
      </Field>
      <Field id="password" label="Palavra-passe" error={errors.password?.message}>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          disabled={isLoading}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        <PasswordStrength password={password} />
      </Field>

      <div>
        <label className="flex min-h-[44px] cursor-pointer items-start gap-2 py-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 rounded accent-teal-600"
            disabled={isLoading}
            aria-invalid={!!errors.terms}
            aria-describedby={errors.terms ? "terms-error" : undefined}
            {...register("terms")}
          />
          <span>Li e aceito os Termos de Utilização e a Política de Privacidade da Pérola.</span>
        </label>
        {errors.terms && (
          <p id="terms-error" className="text-xs text-rose-600">
            {errors.terms.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />A criar a sua conta Pérola...
          </>
        ) : (
          "Criar Conta"
        )}
      </Button>
    </form>
  );
}
