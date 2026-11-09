"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Store,
  MapPin,
  Globe2,
  Clock,
  Sparkles,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PhoneInputCV } from "@/features/auth/components";
import { BusinessPreviewCard } from "@/components/admin/onboarding/business-preview-card";
import { ISLAND_CITIES, ISLANDS } from "@/lib/utils/geography";
import {
  updateBusinessSchema,
  type UpdateBusinessFormValues,
} from "../schemas/settings.schema";
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import type { BusinessResponse } from "../types/settings.types";
import { useBusinessSettings } from "../hooks/use-settings";
import { useChangeBusinessStatus, useUpdateBusinessSettings } from "../hooks/use-settings-mutations";

export function BusinessSettingsContainer() {
  const user = useAuthStore((s) => s.user);
  const memberships = useAuthStore((s) => s.memberships);
  const activeTenantId = useTenantStore((s) => s.activeBusinessId);

  const businessId = activeTenantId || memberships[0]?.businessId || "";

  // 1. Fetch current business data
  const {
    data: business,
    isLoading,
    isError,
    refetch,
  } = useBusinessSettings(businessId);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateBusinessFormValues>({
    resolver: zodResolver(updateBusinessSchema),
    defaultValues: {
      name: "",
      island: "Santiago",
      city: "Praia",
      location: "",
      phone: "",
      isActive: true,
    },
    mode: "onChange",
  });

  // Extract raw 7 digits from +238 phone
  const extractPhoneDigits = (rawPhone: string) => {
    if (!rawPhone) return "";
    return rawPhone.replace(/\D/g, "").replace(/^238/, "").slice(0, 7);
  };

  // Pre-fill form when business data loads
  useEffect(() => {
    if (business) {
      reset({
        name: business.name || "",
        island: business.island || "Santiago",
        city: business.city || "Praia",
        location: business.location || "",
        phone: extractPhoneDigits(business.contactPhone || ""),
        isActive: business.isActive ?? true,
      });
    }
  }, [business, reset]);

  const watchedValues = watch();
  const selectedIsland = watch("island");
  const availableCities = ISLAND_CITIES[selectedIsland] || [];
  const isActive = watch("isActive");

  // Keep city aligned if island changes
  useEffect(() => {
    if (availableCities.length > 0 && !availableCities.includes(watch("city"))) {
      setValue("city", availableCities[0], { shouldValidate: true });
    }
  }, [selectedIsland, availableCities, setValue, watch]);

  // Mutation to update business and mutation to toggle status
  const updateMutation = useUpdateBusinessSettings(businessId);
  const toggleStatusMutation = useChangeBusinessStatus(businessId);

  const isBusinessActive = business?.isActive ?? isActive;

  const onSubmit = async (data: UpdateBusinessFormValues) => {
    const updated = await updateMutation.mutateAsync({
      name: data.name,
      island: data.island,
      city: data.city,
      location: data.location,
      contactPhone: `+238${data.phone}`,
      isActive: data.isActive,
    });
    reset({
      name: updated.name,
      island: updated.island,
      city: updated.city,
      location: updated.location,
      phone: extractPhoneDigits(updated.contactPhone),
      isActive: updated.isActive,
    });
  };

  // EMPTY STATE: User does not have a registered business
  if (!businessId && !isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-xs">
          <Store className="w-8 h-8 text-teal-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Nenhum salão registado nesta conta
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Para gerir definições, receber agendamentos online e configurar a sua equipa em Cabo Verde,
            inicie o registo do seu espaço comercial no Pérola.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/onboarding">
            <Button className="min-h-[46px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 shadow-md">
              <Store className="w-4 h-4 mr-2" />
              Registar Meu Salão Agora
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2 pb-4 border-b border-slate-200">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-[480px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (isError) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Erro ao carregar dados do salão
        </h3>
        <p className="text-xs text-slate-500">
          Não foi possível comunicar com o servidor para obter os dados do estabelecimento.
        </p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
              <Store className="w-5 h-5 text-teal-600" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Definições e Perfil do Salão
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gira os dados comerciais, morada em Cabo Verde, visibilidade no Marketplace e contactos oficiais.
          </p>
        </div>

        {/* View on Marketplace link */}
        {businessId && (
          <Link
            href={`/businesses/${businessId}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50/70 border border-teal-200/80 hover:bg-teal-100 px-3.5 py-2 rounded-xl transition-colors shadow-2xs self-start sm:self-auto"
          >
            <span>Ver Perfil Público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Main Grid: Form (7 cols) + Live Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 1. Status de Visibilidade Pública (Switch com Ação Imediata) */}
            <div
              className={`p-5 rounded-2xl border transition-all ${isBusinessActive
                  ? "bg-emerald-50/40 border-emerald-200 shadow-2xs"
                  : "bg-amber-50/40 border-amber-200 shadow-2xs"
                }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isBusinessActive ? (
                      <Eye className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-amber-600" />
                    )}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Visibilidade no Marketplace
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isBusinessActive
                      ? "O salão está ATIVO e visível a clientes de Cabo Verde para agendamentos online."
                      : "O salão está PAUSADO. Não aparecerá no feed de pesquisa e novos agendamentos ficam suspensos."}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={isBusinessActive}
                    disabled={toggleStatusMutation.isPending}
                    onCheckedChange={() => toggleStatusMutation.mutate()}
                    className="data-[state=checked]:bg-emerald-600"
                    aria-label="Alternar visibilidade pública do salão"
                  />
                </div>
              </div>
            </div>

            {/* 2. Identidade Comercial */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Store className="w-4 h-4 text-teal-600" />
                Dados Comerciais
              </h3>

              {/* Nome do Salão */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Nome do Estabelecimento <span className="text-teal-600">*</span>
                </label>
                <Input
                  {...register("name")}
                  placeholder="Ex: Salão Pérola da Praia"
                  className="min-h-[44px] rounded-xl border-slate-200 bg-white font-medium"
                />
                {errors.name && (
                  <p className="text-xs text-rose-600 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Telefone de Contacto (+238) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Telefone / WhatsApp Oficial <span className="text-teal-600">*</span>
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInputCV
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      invalid={Boolean(errors.phone)}
                      id="business-phone"
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-xs text-rose-600 font-medium">
                    {errors.phone.message}
                  </p>
                )}
                <p className="text-[11px] text-slate-400">
                  Utilizado para notificações operacionais e contacto direto dos clientes.
                </p>
              </div>
            </div>

            {/* 3. Localização em Cabo Verde */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-4 h-4 text-teal-600" />
                Localização & Morada
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ilha */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="business-island-select"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
                  >
                    <Globe2 className="w-3.5 h-3.5 text-teal-600" />
                    Ilha <span className="text-teal-600">*</span>
                  </label>
                  <select
                    id="business-island-select"
                    {...register("island")}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 cursor-pointer"
                  >
                    {ISLANDS.map((island) => (
                      <option key={island} value={island}>
                        {island}
                      </option>
                    ))}
                  </select>
                  {errors.island && (
                    <p className="text-xs text-rose-600 font-medium">
                      {errors.island.message}
                    </p>
                  )}
                </div>

                {/* Concelho / Cidade */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="business-city-select"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    Concelho / Cidade <span className="text-teal-600">*</span>
                  </label>
                  <select
                    id="business-city-select"
                    {...register("city")}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 cursor-pointer"
                  >
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-xs text-rose-600 font-medium">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Morada Física e Referências */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Endereço e Referência Local <span className="text-teal-600">*</span>
                </label>
                <Input
                  {...register("location")}
                  placeholder="Ex: Rua Pedonal do Plateau, Edifício Colonial nº 12, 1º Andar"
                  className="min-h-[44px] rounded-xl border-slate-200 bg-white font-medium"
                />
                {errors.location && (
                  <p className="text-xs text-rose-600 font-medium">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Fuso Horário Padronizado */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Fuso Horário Oficial:
                </span>
                <span className="font-semibold text-slate-800">
                  Atlantic/Cape_Verde (UTC-1 constante)
                </span>
              </div>
            </div>

            {/* Sticky Save Bar */}
            <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                {isDirty ? (
                  <span className="text-amber-700 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    Tem alterações não salvas nas definições do salão.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Todas as informações estão sincronizadas.
                  </span>
                )}
              </div>

              <Button
                type="submit"
                disabled={updateMutation.isPending || !isDirty}
                className="w-full sm:w-auto min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition-all px-6"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    A Salvar Alterações...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5">
          <BusinessPreviewCard
            name={watchedValues.name}
            island={watchedValues.island}
            city={watchedValues.city}
            location={watchedValues.location}
            phone={watchedValues.phone}
          />
        </div>
      </div>
    </div>
  );
}
