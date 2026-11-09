"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeeServices,
  changeEmployeeStatus,
} from "../api/employee.api";
import { employeeKeys } from "../queries/employee.keys";
import { serviceKeys } from "@/features/services/queries/service.keys";
import type {
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from "../types/employee.types";

export function useCreateEmployee(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeePayload) => createEmployee(businessId, data),
    onSuccess: (newEmployee) => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.list(businessId) });
      void queryClient.invalidateQueries({ queryKey: serviceKeys.list(businessId) });
      toast.success(`Colaborador "${newEmployee.displayName}" adicionado com sucesso!`);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar colaborador.");
    },
  });
}

export function useUpdateEmployee(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      payload,
    }: {
      employeeId: string;
      payload: UpdateEmployeePayload;
    }) => updateEmployee(businessId, employeeId, payload),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.list(businessId) });
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.detail(businessId, updated.id),
      });
      void queryClient.invalidateQueries({ queryKey: serviceKeys.list(businessId) });
      toast.success(`Dados de "${updated.displayName}" atualizados!`);
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Erro ao atualizar dados do colaborador.",
      );
    },
  });
}

export function useChangeEmployeeStatus(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) => changeEmployeeStatus(businessId, employeeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.list(businessId) });
      void queryClient.invalidateQueries({ queryKey: serviceKeys.list(businessId) });
      toast.success("Status do colaborador alterado com sucesso!");
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Erro ao alterar status do colaborador.",
      );
    },
  });
}

export function useToggleEmployeeActive(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      active,
    }: {
      employeeId: string;
      active: boolean;
    }) => updateEmployee(businessId, employeeId, { isActive: active }),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.list(businessId) });
      void queryClient.invalidateQueries({ queryKey: serviceKeys.list(businessId) });
      toast.success(
        variables.active
          ? "Colaborador ativado com sucesso."
          : "Colaborador desativado da escala ativa.",
      );
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Erro ao alterar estado do colaborador.",
      );
    },
  });
}

export function useDeleteEmployee(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) => deleteEmployee(businessId, employeeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.list(businessId) });
      void queryClient.invalidateQueries({ queryKey: serviceKeys.list(businessId) });
      toast.success("Colaborador removido da equipa.");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Erro ao remover colaborador.");
    },
  });
}

export function useUpdateEmployeeServices(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      serviceIds,
    }: {
      employeeId: string;
      serviceIds: string[];
    }) => updateEmployeeServices(businessId, employeeId, serviceIds),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.list(businessId) });
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.services(businessId, variables.employeeId),
      });
      void queryClient.invalidateQueries({ queryKey: serviceKeys.list(businessId) });
      toast.success("Serviços atribuídos atualizados com sucesso!");
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Erro ao atribuir serviços ao colaborador.",
      );
    },
  });
}

