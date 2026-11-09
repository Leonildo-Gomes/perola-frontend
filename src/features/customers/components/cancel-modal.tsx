"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCancelAppointment } from "../hooks/use-customer-mutations";
import {
  type CancelAppointmentFormValues,
  cancelAppointmentSchema,
} from "../schemas/customer.schema";
import type { CustomerAppointment } from "../types/customer.types";

interface CancelModalProps {
  appointment: CustomerAppointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CancelModal({ appointment, isOpen, onClose }: CancelModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelAppointmentFormValues>({
    resolver: zodResolver(cancelAppointmentSchema),
    defaultValues: { reason: "" },
  });

  const mutation = useCancelAppointment({
    onSuccess: () => {
      reset();
      onClose();
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (!appointment) return;
    mutation.mutate({
      appointmentId: appointment.id,
      payload: { reason: data.reason || undefined },
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertCircle className="h-6 w-6" aria-hidden />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-slate-900">
            Cancelar Marcação?
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-slate-600">
            Tem a certeza que pretende cancelar o agendamento de{" "}
            <span className="font-semibold text-slate-900">{appointment.serviceName}</span>{" "}
            no <span className="font-semibold text-slate-900">{appointment.businessName}</span>?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <div>
            <label htmlFor="cancel-reason" className="block text-xs font-semibold text-slate-700 mb-1">
              Motivo do cancelamento (opcional)
            </label>
            <textarea
              id="cancel-reason"
              rows={3}
              placeholder="Ex: Imprevisto de horário, reagendado noutro dia..."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-perola-deep focus:outline-none focus:ring-2 focus:ring-perola-deep/20"
              {...register("reason")}
            />
            {errors.reason?.message && (
              <p className="mt-1 text-xs text-rose-600">{errors.reason.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
            >
              Manter Marcação
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={mutation.isPending}
              className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A cancelar...
                </>
              ) : (
                "Sim, Cancelar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

