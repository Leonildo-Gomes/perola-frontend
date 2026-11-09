"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  cancelAppointment,
  requestReschedule,
  submitReview,
} from "../api/customer.api";
import { customerKeys } from "../queries/customer.keys";
import type {
  CancelAppointmentPayload,
  CreateReviewPayload,
  RescheduleAppointmentPayload,
} from "../types/customer.types";

export function useCancelAppointment(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      payload,
    }: {
      appointmentId: string;
      payload?: CancelAppointmentPayload;
    }) => cancelAppointment(appointmentId, payload),
    onSuccess: () => {
      toast.success("Marcação cancelada com sucesso.");
      void queryClient.invalidateQueries({ queryKey: customerKeys.myBookings() });
      void queryClient.invalidateQueries({ queryKey: ["schedules"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erro ao cancelar marcação. Tente novamente.",
      );
      options?.onError?.(error);
    },
  });
}

export function useRescheduleAppointment(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      payload,
    }: {
      appointmentId: string;
      payload: RescheduleAppointmentPayload;
    }) => requestReschedule(appointmentId, payload),
    onSuccess: () => {
      toast.success("Pedido de reagendamento enviado ao salão.");
      void queryClient.invalidateQueries({ queryKey: customerKeys.myBookings() });
      void queryClient.invalidateQueries({ queryKey: ["schedules"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erro ao reagendar marcação. Tente novamente.",
      );
      options?.onError?.(error);
    },
  });
}

export function useSubmitReview(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      payload,
    }: {
      appointmentId: string;
      payload: CreateReviewPayload;
    }) => submitReview(appointmentId, payload),
    onSuccess: () => {
      toast.success("Avaliação enviada com sucesso! Obrigado pelo feedback.");
      void queryClient.invalidateQueries({ queryKey: customerKeys.myBookings() });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erro ao enviar avaliação. Tente novamente.",
      );
      options?.onError?.(error);
    },
  });
}

