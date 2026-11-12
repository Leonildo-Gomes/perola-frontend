"use client";

import { useEffect } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Loader2, Mail, Save, User } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploadField } from "@/components/shared";
import { PhoneInputCV } from "@/features/auth/components";
import { authApi } from "@/features/auth/api/auth.api";
import { CV_PHONE_REGEX } from "@/features/auth/schemas/auth.schema";
import { ApiError } from "@/lib/api/errors";
import { useAuthStore } from "@/stores/auth-store";

const profileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(120, "O nome não pode exceder 120 caracteres"),
  phone: z
    .string()
    .regex(
      CV_PHONE_REGEX,
      "O número deve ter 7 dígitos e começar por 9, 5, 2 ou 3 (rede de Cabo Verde)",
    ),
  avatarUrl: z.string().nullable().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function extractCvDigits(rawPhone?: string | null): string {
  if (!rawPhone) return "";
  return rawPhone.replace(/\D/g, "").replace(/^238/, "").slice(0, 7);
}

export function UserProfileContainer() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const updateUser = useAuthStore((s) => s.updateUser);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: extractCvDigits(user?.phone),
      avatarUrl: user?.avatarUrl ?? null,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        phone: extractCvDigits(user.phone),
        avatarUrl: user.avatarUrl ?? null,
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      authApi.updateProfile({
        name: values.name,
        phone: `+238${values.phone}`,
        avatarUrl: values.avatarUrl ?? null,
      }),
    onSuccess: (updated) => {
      updateUser({
        name: updated.name,
        phone: updated.phone,
        avatarUrl: updated.avatarUrl ?? null,
      });
      reset({
        name: updated.name,
        phone: extractCvDigits(updated.phone),
        avatarUrl: updated.avatarUrl ?? null,
      });
      toast.success("Perfil atualizado com sucesso.");
    },
    onError: (err) => {
      const message =
        err instanceof ApiError
          ? err.problem.detail || err.message
          : "Não foi possível atualizar o seu perfil.";
      toast.error(message);
    },
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <User className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Inicie sessão para gerir o seu perfil
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Aceda à sua conta Pérola para atualizar a sua fotografia e dados de contacto.
          </p>
          <Button asChild className="mt-6 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700">
            <Link href="/login?next=/profile">Iniciar Sessão</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          O Meu Perfil
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Gerencie a sua fotografia de perfil e os dados de contacto usados nas suas marcações.
        </p>
      </div>

      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <Controller
          name="avatarUrl"
          control={control}
          render={({ field }) => (
            <ImageUploadField
              scope="USER_AVATAR"
              label="Fotografia de Perfil"
              description="Aparece no menu da sua conta e nas suas avaliações (JPEG, PNG ou WebP até 5 MB)."
              value={field.value}
              onChange={field.onChange}
              aspect="avatar"
              disabled={mutation.isPending}
            />
          )}
        />

        <div className="space-y-1.5">
          <label
            htmlFor="profile-name"
            className="text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            Nome Completo <span className="text-teal-600">*</span>
          </label>
          <Input
            id="profile-name"
            {...register("name")}
            placeholder="Ex: Ana Paula Tavares"
            disabled={mutation.isPending}
            className="min-h-[44px] rounded-xl border-slate-200"
          />
          {errors.name && (
            <p className="text-xs font-medium text-rose-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Email da Conta
          </label>
          <div className="flex min-h-[44px] items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-500">
            <Mail className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Telemóvel (+238) <span className="text-teal-600">*</span>
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInputCV
                id="profile-phone"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                invalid={Boolean(errors.phone)}
                disabled={mutation.isPending}
              />
            )}
          />
          {errors.phone && (
            <p className="text-xs font-medium text-rose-600">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <Button
            type="submit"
            disabled={mutation.isPending || !isDirty}
            className="min-h-[44px] rounded-xl bg-teal-600 px-6 font-semibold text-white hover:bg-teal-700"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A guardar...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
