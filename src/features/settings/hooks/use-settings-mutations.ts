"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBusiness, updateBusiness } from "../api/settings.api";
import { settingsKeys } from "../queries/settings.keys";
import type {
  CreateBusinessPayload,
  UpdateBusinessPayload,
} from "../types/settings.types";

export function useCreateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBusinessPayload) => createBusiness(payload),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.business() });
      void queryClient.invalidateQueries({ queryKey: ["marketplace"] });
      toast.success(`Salão "${created.name}" registado com sucesso!`);
    },
    onError: () => {
      toast.error(
        "Não foi possível registar o salão. Verifique os dados e tente novamente.",
      );
    },
  });
}

export function useUpdateBusinessSettings(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBusinessPayload) =>
      updateBusiness(businessId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: settingsKeys.businessDetail(businessId),
      });
      void queryClient.invalidateQueries({ queryKey: ["marketplace"] });
      toast.success("Definições do salão atualizadas com sucesso!");
    },
    onError: () => {
      toast.error("Não foi possível salvar as alterações. Verifique os dados e tente novamente.");
    },
  });
}

