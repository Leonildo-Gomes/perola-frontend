"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  openMonthlySchedule,
  createWeeklySchedule,
  updateWeeklySchedule,
  createTimeOff,
  deleteTimeOff,
} from "../api/availability.api";
import { availabilityKeys } from "../queries/availability.keys";
import type {
  OpenMonthRequest,
  CreateTimeOffPayload,
  ScheduleDay,
} from "../types/availability.types";

export function useOpenMonthlySchedule(employeeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OpenMonthRequest) =>
      openMonthlySchedule(employeeId, payload),
    onSuccess: (_, variables) => {
      toast.success(
        `Agenda aberta com sucesso para o mês ${variables.month}/${variables.year}!`,
      );
      void queryClient.invalidateQueries({
        queryKey: availabilityKeys.monthlyByEmployee(employeeId),
      });
      void queryClient.invalidateQueries({
        queryKey: ["slots"],
      });
    },
    onError: () => {
      toast.error(
        "Não foi possível abrir a agenda mensal. Verifique a conexão e tente novamente.",
      );
    },
  });
}

export function useSaveWeeklySchedule(
  employeeId: string,
  currentScheduleId?: string | null,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      isDefault: boolean;
      days: ScheduleDay[];
    }) => {
      if (currentScheduleId) {
        return updateWeeklySchedule(employeeId, currentScheduleId, payload);
      }
      return createWeeklySchedule(employeeId, payload);
    },
    onSuccess: () => {
      toast.success("Expediente semanal salvo com sucesso!");
      void queryClient.invalidateQueries({
        queryKey: availabilityKeys.weeklyByEmployee(employeeId),
      });
      void queryClient.invalidateQueries({
        queryKey: ["slots"],
      });
    },
    onError: () => {
      toast.error(
        "Erro ao salvar o expediente semanal. Verifique os horários e tente novamente.",
      );
    },
  });
}

export function useCreateTimeOff(employeeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTimeOffPayload) =>
      createTimeOff(employeeId, payload),
    onSuccess: () => {
      toast.success(
        "Ausência registada com sucesso! Horários bloqueados na agenda.",
      );
      void queryClient.invalidateQueries({
        queryKey: availabilityKeys.timeOffByEmployee(employeeId),
      });
      void queryClient.invalidateQueries({
        queryKey: ["slots"],
      });
    },
    onError: () => {
      toast.error(
        "Não foi possível registar a ausência. Verifique a ligação e tente novamente.",
      );
    },
  });
}

export function useDeleteTimeOff(employeeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (timeOffId: string) => deleteTimeOff(employeeId, timeOffId),
    onSuccess: () => {
      toast.success("Bloqueio de agenda removido com sucesso!");
      void queryClient.invalidateQueries({
        queryKey: availabilityKeys.timeOffByEmployee(employeeId),
      });
      void queryClient.invalidateQueries({
        queryKey: ["slots"],
      });
    },
    onError: () => {
      toast.error("Erro ao remover ausência. Tente novamente.");
    },
  });
}

