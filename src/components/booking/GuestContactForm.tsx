"use client";

import { CheckCircle2, Mail, ShieldCheck, User } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";
import { PhoneInputCV } from "@/features/auth/components/phone-input-cv";
import type { BookingFormValues } from "@/features/bookings/schemas/booking.schema";
import { cn } from "@/lib/utils/utils";
import { useAuthStore } from "@/stores/auth-store";

interface GuestContactFormProps {
  register: UseFormRegister<BookingFormValues>;
  control: Control<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
  disabled?: boolean;
  className?: string;
}

export function GuestContactForm({
  register,
  control,
  errors,
  disabled = false,
  className,
}: GuestContactFormProps) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated && user) {
    return (
      <section
        aria-label="Dados do utilizador autenticado"
        className={cn(
          "rounded-2xl border border-teal-200 bg-teal-50/60 p-4 sm:p-5 shadow-sm transition-all",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm">
            <User className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{user.name}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-800">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Sessão Iniciada
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs sm:text-sm text-slate-600">
              {user.email} {user.phone ? `· ${user.phone}` : ""}
            </p>
            <p className="mt-1.5 text-xs text-teal-800">
              A sua marcação será automaticamente guardada na sua área de cliente.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Os Seus Dados de Contacto"
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Os Seus Dados de Contacto
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Não precisa de criar conta para agendar. Enviaremos o comprovativo por SMS e WhatsApp (+238).
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
          Sem Registo
        </span>
      </div>

      <div className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="guest-customer-name"
            className="mb-1 block text-sm font-semibold text-slate-900"
          >
            Nome Completo <span className="text-rose-600">*</span>
          </label>
          <div className="relative flex items-center">
            <span
              className="pointer-events-none absolute left-3.5 text-slate-400"
              aria-hidden
            >
              <User className="h-4 w-4" />
            </span>
            <input
              id="guest-customer-name"
              type="text"
              autoComplete="name"
              placeholder="ex: Carlos Semedo"
              disabled={disabled}
              aria-invalid={Boolean(errors.customerName)}
              aria-describedby={errors.customerName ? "guest-name-error" : undefined}
              className={cn(
                "h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600",
                errors.customerName && "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500",
              )}
              {...register("customerName")}
            />
          </div>
          {errors.customerName?.message && (
            <p id="guest-name-error" className="mt-1 text-xs text-rose-600">
              {errors.customerName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="guest-customer-email"
            className="mb-1 block text-sm font-semibold text-slate-900"
          >
            Email para confirmação <span className="text-rose-600">*</span>
          </label>
          <div className="relative flex items-center">
            <span
              className="pointer-events-none absolute left-3.5 text-slate-400"
              aria-hidden
            >
              <Mail className="h-4 w-4" />
            </span>
            <input
              id="guest-customer-email"
              type="email"
              autoComplete="email"
              placeholder="seu.email@exemplo.cv"
              disabled={disabled}
              aria-invalid={Boolean(errors.customerEmail)}
              aria-describedby={
                errors.customerEmail ? "guest-email-error" : "guest-email-hint"
              }
              className={cn(
                "h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600",
                errors.customerEmail && "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500",
              )}
              {...register("customerEmail")}
            />
          </div>
          {errors.customerEmail?.message ? (
            <p id="guest-email-error" className="mt-1 text-xs text-rose-600">
              {errors.customerEmail.message}
            </p>
          ) : (
            <p id="guest-email-hint" className="mt-1 text-xs text-slate-500">
              Enviaremos os detalhes do agendamento e recibo por email.
            </p>
          )}
        </div>

        {/* Phone Input with +238 */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor="guest-customer-phone"
              className="text-sm font-semibold text-slate-900"
            >
              Telefone de Cabo Verde <span className="text-rose-600">*</span>
            </label>
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" aria-hidden />
              WhatsApp Ativo
            </span>
          </div>
          <Controller
            control={control}
            name="customerPhone"
            render={({ field }) => (
              <PhoneInputCV
                id="guest-customer-phone"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={disabled}
                invalid={Boolean(errors.customerPhone)}
                describedBy={
                  errors.customerPhone ? "guest-phone-error" : "guest-phone-hint"
                }
              />
            )}
          />
          {errors.customerPhone?.message ? (
            <p id="guest-phone-error" className="mt-1 text-xs text-rose-600">
              {errors.customerPhone.message}
            </p>
          ) : (
            <p id="guest-phone-hint" className="mt-1 text-xs text-slate-500">
              Enviaremos um código SMS com link direto para aceder à reserva.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
