"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  acceptReschedule,
  cancelSalonAppointment,
  completeAppointment,
  confirmAppointment,
  createSalonAppointment,
  rejectReschedule,
} from "../api/schedule.api";
import { scheduleKeys } from "../queries/schedule.keys";
import type {
  CancelAppointmentPayload,
  CreateSalonAppointmentPayload,
} from "../types/schedule.types";

export function useConfirmAppointment(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => confirmAppointment(appointmentId),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: scheduleKeys.salon() });
      toast.success(
        `Agendamento de ${updated.customerName || "cliente"} confirmado!`,
      );
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Erro ao confirmar agendamento.",
      );
    },
  });
}

export function useCompleteAppointment(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => completeAppointment(appointmentId),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: scheduleKeys.salon() });
      toast.success(
        `Atendimento de ${updated.customerName || "cliente"} marcado como concluído!`,
      );
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Erro ao concluir atendimento.",
      );
    },
  });
}

export function useCancelSalonAppointment(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      args:
        | string
        | { appointmentId: string; payload?: CancelAppointmentPayload },
    ) => {
      const id = typeof args === "string" ? args : args.appointmentId;
      const payload = typeof args === "string" ? undefined : args.payload;
      return cancelSalonAppointment(id, payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleKeys.salon() });
      void queryClient.invalidateQueries({ queryKey: ["slots"] });
      toast.success("Agendamento cancelado.");
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Erro ao cancelar agendamento.",
      );
    },
  });
}

export function useAcceptReschedule(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => acceptReschedule(appointmentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleKeys.salon() });
      toast.success("Novo horário aceito com sucesso!");
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Erro ao aceitar reagendamento.",
      );
    },
  });
}

export function useRejectReschedule(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => rejectReschedule(appointmentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleKeys.salon() });
      toast.success("Proposta de reagendamento rejeitada.");
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Erro ao rejeitar reagendamento.",
      );
    },
  });
}

export function useCreateSalonAppointment(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSalonAppointmentPayload) =>
      createSalonAppointment(businessId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleKeys.salon() });
      void queryClient.invalidateQueries({ queryKey: ["slots"] });
      toast.success("Agendamento criado com sucesso na agenda!");
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Erro ao criar agendamento.",
      );
    },
  });
}
