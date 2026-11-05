"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { requestReschedule } from "@/lib/api/appointments";
import {
  formatInstantLong,
  formatKeyLong,
  formatTime,
  upcomingDateKeys,
} from "@/lib/datetime";
import {
  type RescheduleAppointmentFormValues,
  rescheduleAppointmentSchema,
} from "@/lib/validations/appointments";
import type { CustomerAppointment } from "@/types/appointments";

interface RescheduleModalProps {
  appointment: CustomerAppointment | null;
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

export function RescheduleModal({ appointment, isOpen, onClose }: RescheduleModalProps) {
  const queryClient = useQueryClient();
  const availableDates = upcomingDateKeys(14);
  const [selectedDate, setSelectedDate] = useState(availableDates[1] || availableDates[0]);
  const [selectedTime, setSelectedTime] = useState("10:00");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RescheduleAppointmentFormValues>({
    resolver: zodResolver(rescheduleAppointmentSchema),
    defaultValues: {
      date: availableDates[1] || availableDates[0],
      time: "10:00",
      reason: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RescheduleAppointmentFormValues) => {
      if (!appointment) throw new Error("Nenhuma marcação selecionada");
      // Cape Verde is UTC-1 constant
      const isoWithOffset = `${data.date}T${data.time}:00-01:00`;
      return requestReschedule(appointment.id, {
        proposedStartTime: isoWithOffset,
        reason: data.reason || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Proposta de reagendamento enviada! O salão irá analisar em breve.");
      void queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      reset();
      onClose();
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Não foi possível solicitar o reagendamento. Tente novamente.",
      );
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate({
      date: selectedDate,
      time: selectedTime,
      reason: data.reason,
    });
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-perola-mint text-perola-deep">
            <Calendar className="h-6 w-6" aria-hidden />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-slate-900">
            Reagendar Atendimento
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-slate-600">
            Proponha uma nova data e hora para{" "}
            <span className="font-semibold text-slate-900">{appointment.serviceName}</span> no{" "}
            <span className="font-semibold text-slate-900">{appointment.businessName}</span>.
          </DialogDescription>
        </DialogHeader>

        {/* Current booking recap */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-700">Horário atual agendado:</p>
          <p className="flex items-center gap-1.5 text-slate-900 font-medium">
            <Clock className="h-3.5 w-3.5 text-perola-deep" />
            {formatInstantLong(appointment.startTime)} às {formatTime(appointment.startTime)}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          {/* Date selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              1. Selecione a nova data pretendida
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-xl">
              {availableDates.map((dateKey) => (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDate(dateKey)}
                  className={`min-h-[44px] px-2.5 py-1.5 text-xs rounded-lg font-medium text-left border transition-all ${
                    selectedDate === dateKey
                      ? "bg-perola-deep text-white border-perola-deep shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <p className="truncate font-semibold capitalize">{formatKeyLong(dateKey)}</p>
                  <p className="text-[10px] opacity-80">{dateKey}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Time selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              2. Selecione o novo horário sugerido (Fuso de Cabo Verde UTC-1)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-32 overflow-y-auto p-1 border border-slate-200 rounded-xl">
              {COMMON_TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`min-h-[44px] py-1 text-xs rounded-lg font-semibold border transition-all ${
                    selectedTime === slot
                      ? "bg-perola-deep text-white border-perola-deep shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reschedule-reason" className="block text-xs font-semibold text-slate-700 mb-1">
              Motivo do reagendamento (opcional)
            </label>
            <textarea
              id="reschedule-reason"
              rows={2}
              placeholder="Ex: Imprevisto no trabalho, preferência pelo período da manhã..."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-perola-deep focus:outline-none focus:ring-2 focus:ring-perola-deep/20"
              {...register("reason")}
            />
            {errors.reason?.message && (
              <p className="mt-1 text-xs text-rose-600">{errors.reason.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="brand"
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A enviar proposta...
                </>
              ) : (
                "Enviar Proposta"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

