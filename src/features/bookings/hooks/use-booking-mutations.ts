"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import { createAppointment } from "../api/booking.api";
import { bookingKeys } from "../queries/booking.keys";
import { isSlotConflictError } from "@/lib/api/errors";
import type { CreateAppointmentRequest } from "../types/booking.types";

interface UseCreateBookingOptions {
  onConflict?: (conflictedStartTime: string) => void;
}

export function useCreateBooking(options?: UseCreateBookingOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isPendingRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (body: CreateAppointmentRequest) => createAppointment(body),
    onMutate: () => {
      isPendingRef.current = true;
    },
    onSettled: () => {
      isPendingRef.current = false;
    },
    onSuccess: (appointment) => {
      queryClient.setQueryData(
        bookingKeys.appointment(appointment.id),
        appointment,
      );
      void queryClient.invalidateQueries({ queryKey: ["slots"] });
      void queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["schedules"] });
      router.push(`/book/confirmed/${appointment.id}`);
    },
    onError: (error, vars) => {
      if (isSlotConflictError(error)) {
        void queryClient.invalidateQueries({ queryKey: ["slots"] });
        options?.onConflict?.(vars.startTime);
        return;
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir a marcação. Tente novamente.",
      );
    },
  });

  return {
    ...mutation,
    isPendingRef,
  };
}

