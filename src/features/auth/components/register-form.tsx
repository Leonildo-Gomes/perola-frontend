"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Mail, ShieldCheck, Store, User } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { passwordStrength, registerSchema, type RegisterFormValues, type UserIntent } from "../schemas/auth.schema";
import { AuthAlert } from "./auth-alert";
import { Field } from "./field";
import { IconInput } from "./icon-input";
import { PasswordInput } from "./password-input";
import { PasswordStrength, STRENGTH_LABELS } from "./password-strength";
import { PhoneInputCV } from "./phone-input-cv";

export interface RegisterFormProps {
  isLoading: boolean;
  /** Generic server error (non-conflict). */
  serverError?: string | null;
  /** 409: email already registered. */
  emailConflict?: boolean;
  onSubmit: (values: RegisterFormValues) => Promise<void>;
}

const INTENTS: { value: UserIntent; label: string; icon: typeof User }[] = [
  { value: "CUSTOMER", label: "Agendar serviços", icon: User },
  { value: "BUSINESS_OWNER", label: "Registar salão", icon: Store },
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
          <fieldset className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1" disabled={isLoading}>
            <legend className="sr-only">O que pretende fazer?</legend>
            {INTENTS.map(({ value, label, icon: Icon }) => {
              const selected = field.value === value;
              return (
                <label
                  key={value}
                  className={cn(
                    "flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-teal-600",
                    selected ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-900",
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
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </label>
              );
            })}
          </fieldset>
        )}
      />

      <Field id="name" label="Nome Completo" error={errors.name?.message}>
        <IconInput
          icon={User}
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
        <IconInput
          icon={Mail}
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
      <Field id="phone" label="Telefone de Cabo Verde" error={errors.phone?.message}>
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
      <Field
        id="password"
        label="Palavra-passe"
        error={errors.password?.message}
        aside={
          password.length >= 8 ? (
            <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
              {STRENGTH_LABELS[passwordStrength(password)]}
            </span>
          ) : null
        }
      >
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
          <span>
            Li e aceito os <span className="font-semibold text-teal-700 underline">Termos de Utilização</span> e a{" "}
            <span className="font-semibold text-teal-700 underline">Política de Privacidade</span> do Pérola.
          </span>
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
          <>
            Criar Conta
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </>
        )}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 text-teal-600" aria-hidden />
        Dados protegidos e suporte local em Cabo Verde
      </p>
    </form>
  );
}
