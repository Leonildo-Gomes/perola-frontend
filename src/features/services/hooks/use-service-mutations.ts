"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createService, updateService, deleteService } from "../api/service.api";
import { serviceKeys } from "../queries/service.keys";
import type { CreateServicePayload, UpdateServicePayload } from "../types/service.types";

export function useCreateService(businessId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateServicePayload) => createService(businessId, data),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: serviceKeys.list(businessId) });
            toast.success("Serviço criado com sucesso no catálogo!");
        },
        onError: (err: unknown) => {
            toast.error(err instanceof Error ? err.message : "Erro ao criar serviço.");
        },
    });
}

export function useUpdateService(businessId: string, serviceId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateServicePayload) => updateService(businessId, serviceId, data),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: serviceKeys.list(businessId) });
            toast.success("Serviço atualizado com sucesso no catálogo!");
        },
        onError: (err: unknown) => {
            toast.error(err instanceof Error ? err.message : "Erro ao atualizar serviço.");
        },
    });
}

export function useDeleteService(businessId: string, serviceId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteService(businessId, serviceId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: serviceKeys.list(businessId) });
            toast.success("Serviço excluído com sucesso do catálogo!");
        },
        onError: (err: unknown) => {
            toast.error(err instanceof Error ? err.message : "Erro ao excluir serviço.");
        },
    });
}

