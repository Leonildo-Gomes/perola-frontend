"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe2,
  Info,
  Loader2,
  MapPin,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { PhoneInputCV } from "@/features/auth/components";
import { Button } from "@/components/ui/button";
import { createBusiness } from "@/features/settings/api/settings.api";
import { ISLAND_CITIES, ISLANDS } from "@/lib/utils/geography";
import {
  type CreateBusinessFormValues,
  createBusinessSchema,
} from "@/features/settings/schemas/settings.schema";
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import { BusinessPreviewCard } from "./business-preview-card";

export function BusinessOnboardingForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateBusinessFormValues>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      name: "",
      island: "Santiago",
      city: "Praia",
      location: "",
      phone: "",
    },
    mode: "onChange",
  });

  const watchedValues = watch();
  const selectedIsland = watch("island");
  const availableCities = ISLAND_CITIES[selectedIsland] || [];

  // Whenever the island changes, update the city to the first city of that island
  useEffect(() => {
    if (availableCities.length > 0 && !availableCities.includes(watch("city"))) {
      setValue("city", availableCities[0], { shouldValidate: true });
    }
  }, [selectedIsland, availableCities, setValue, watch]);

  const mutation = useMutation({
    mutationFn: (data: CreateBusinessFormValues) => {
      return createBusiness({
        name: data.name,
        island: data.island,
        city: data.city,
        location: data.location,
        contactPhone: `+238${data.phone}`,
        timezone: "Atlantic/Cape_Verde",
      });
    },
    onSuccess: (business) => {
      toast.success("Salão registado com sucesso! Bem-vindo ao Pérola SaaS.");

      // Set as active tenant in global store
      useTenantStore.getState().setActiveBusiness(business.id, business.name, "OWNER");

      // Register membership in authStore
      useAuthStore.getState().addMembership({
        businessId: business.id,
        businessName: business.name,
        role: "OWNER",
      });

      // Redirect to services or schedule configuration
      router.push("/schedule");
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Não foi possível criar o salão. Tente novamente.",
      );
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Column (7 cols) */}
      <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Informações Gerais do Estabelecimento
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Estes detalhes serão exibidos aos clientes no Marketplace e usados nos recibos oficiais do arquipélago.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* 1. Nome Comercial */}
          <div>
            <label htmlFor="business-name" className="block text-xs font-bold text-slate-800 mb-1.5">
              Nome Comercial do Salão <span className="text-perola-deep">*</span>
            </label>
            <div className="relative flex items-center">
              <Store className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                id="business-name"
                type="text"
                placeholder="Ex: Salão Beleza Crioula"
                className={`w-full h-12 pl-10 pr-10 rounded-xl border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${errors.name
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                    : watchedValues.name && !errors.name
                      ? "border-slate-300 focus:border-perola-deep focus:ring-perola-deep/20"
                      : "border-slate-200 focus:border-perola-deep focus:ring-perola-deep/20"
                  }`}
                {...register("name")}
              />
              {watchedValues.name && !errors.name && (
                <span title="Nome disponível" className="absolute right-3.5 text-perola-deep">
                  <CheckCircle2 className="h-5 w-5 fill-perola-deep text-white" />
                </span>
              )}
            </div>
            {errors.name?.message ? (
              <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Nome visível no diretório comercial e na pesquisa
              </p>
            )}
          </div>

          {/* 2. Ilha & Concelho */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ilha */}
            <div>
              <label htmlFor="business-island" className="block text-xs font-bold text-slate-800 mb-1.5">
                Ilha <span className="text-perola-deep">*</span>
              </label>
              <div className="relative flex items-center">
                <Globe2 className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  id="business-island"
                  className="w-full h-12 pl-10 pr-8 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-perola-deep focus:ring-2 focus:ring-perola-deep/20 cursor-pointer appearance-none"
                  {...register("island")}
                >
                  {ISLANDS.map((island) => (
                    <option key={island} value={island}>
                      {island}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 text-slate-400 pointer-events-none text-xs">▼</span>
              </div>
              {errors.island?.message && (
                <p className="mt-1 text-xs text-rose-600">{errors.island.message}</p>
              )}
            </div>

            {/* Concelho / Cidade */}
            <div>
              <label htmlFor="business-city" className="block text-xs font-bold text-slate-800 mb-1.5">
                Concelho / Cidade <span className="text-perola-deep">*</span>
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  id="business-city"
                  className="w-full h-12 pl-10 pr-8 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-perola-deep focus:ring-2 focus:ring-perola-deep/20 cursor-pointer appearance-none"
                  {...register("city")}
                >
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 text-slate-400 pointer-events-none text-xs">▼</span>
              </div>
              {errors.city?.message && (
                <p className="mt-1 text-xs text-rose-600">{errors.city.message}</p>
              )}
            </div>
          </div>

          {/* 3. Morada e Localização */}
          <div>
            <label htmlFor="business-location" className="block text-xs font-bold text-slate-800 mb-1.5">
              Morada e Localização no Concelho <span className="text-perola-deep">*</span>
            </label>
            <div className="relative flex items-center">
              <MapPin className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                id="business-location"
                type="text"
                placeholder="Ex: Rua 5 de Julho, Plateau, Edifício Colonial nº 12"
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-perola-deep focus:ring-2 focus:ring-perola-deep/20"
                {...register("location")}
              />
            </div>
            {errors.location?.message ? (
              <p className="mt-1 text-xs text-rose-600">{errors.location.message}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Visível no mapa do cliente no Marketplace Pérola
              </p>
            )}
          </div>

          {/* 4. Telefone Oficial com +238 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="business-phone" className="block text-xs font-bold text-slate-800">
                Telefone de Contacto Oficial <span className="text-perola-deep">*</span>
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-perola-deep bg-perola-mint px-2 py-0.5 rounded-full">
                WhatsApp Ativo
              </span>
            </div>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInputCV
                  id="business-phone"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  invalid={Boolean(errors.phone)}
                />
              )}
            />
            {errors.phone?.message ? (
              <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">
                Número oficial com 7 dígitos (redes móveis de Cabo Verde iniciadas por 9, 5, 2 ou 3)
              </p>
            )}
          </div>

          {/* 5. Fuso Horário Notice Card */}
          <div className="rounded-xl border border-perola-deep/20 bg-perola-mint/30 p-4 flex gap-3 items-start text-xs">
            <Clock className="h-5 w-5 text-perola-deep shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-bold text-perola-deep">
                Fuso Horário Padrão do Sistema: Atlantic/Cape_Verde (GMT-1 constante)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Todas as marcações da sua agenda física e online respeitarão a hora oficial do arquipélago, sem horário de verão.
              </p>
            </div>
          </div>

          {/* 6. CTA Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="brand"
              disabled={mutation.isPending}
              className="w-full h-12 rounded-xl text-sm font-bold shadow-sm"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A criar salão...
                </>
              ) : (
                <>
                  Criar Salão e Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-center text-xs text-slate-400 mt-2">
              Passo seguinte: Adicionar serviços e equipa
            </p>
          </div>
        </form>
      </div>

      {/* Live Preview Column (5 cols) */}
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
  );
}

