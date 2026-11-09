"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Check, Clock, Loader2, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CV_PHONE_REGEX } from "@/features/auth/schemas/auth.schema";
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { Employee } from "@/features/employees/types/employee.types";
import type { SalonService } from "@/features/services/types/service.types";

const newAppointmentSchema = z.object({
  customerName: z.string().trim().min(2, "Introduza o nome do cliente"),
  customerPhone: z
    .string()
    .trim()
    .regex(CV_PHONE_REGEX, "Número inválido. Deve ter 7 dígitos (iniciando por 9, 5, 2 ou 3)"),
  employeeId: z.string().min(1, "Selecione o profissional"),
  serviceId: z.string().min(1, "Selecione o serviço"),
  time: z.string().min(4, "Indique a hora de início (ex: 10:00)"),
  notes: z.string().max(250).optional(),
});

type NewAppointmentFormValues = z.infer<typeof newAppointmentSchema>;

interface NewAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateKey: string;
  employees: Employee[];
  services: SalonService[];
  onSubmit: (data: {
    customerName: string;
    customerPhone: string;
    employeeId: string;
    serviceId: string;
    startTime: string;
    notes?: string;
  }) => Promise<void>;
}

export function NewAppointmentModal({
  open,
  onOpenChange,
  dateKey,
  employees,
  services,
  onSubmit,
}: NewAppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewAppointmentFormValues>({
    resolver: zodResolver(newAppointmentSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      employeeId: "",
      serviceId: "",
      time: "09:00",
      notes: "",
    },
  });

  const selectedEmployeeId = watch("employeeId");
  const selectedServiceId = watch("serviceId");

  useEffect(() => {
    if (open) {
      reset({
        customerName: "",
        customerPhone: "",
        employeeId: employees[0]?.id || "",
        serviceId: services[0]?.id || "",
        time: "09:00",
        notes: "",
      });
    }
  }, [open, employees, services, reset]);

  const onFormSubmit = async (values: NewAppointmentFormValues) => {
    try {
      setIsSubmitting(true);
      // Combine dateKey (YYYY-MM-DD) and time (HH:MM) to create ISO string in Cape Verde (UTC-1)
      const isoString = `${dateKey}T${values.time}:00-01:00`;
      await onSubmit({
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        employeeId: values.employeeId,
        serviceId: values.serviceId,
        startTime: isoString,
        notes: values.notes,
      });
      onOpenChange(false);
    } catch {
      // Handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Calendar className="h-5 w-5" />
            </span>
            <DialogTitle className="text-lg">Novo Agendamento</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 pt-1">
            Marque um atendimento direto na agenda do salão para o dia{" "}
            <strong className="text-slate-800">{dateKey}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3.5 pt-2">
          {/* Nome do Cliente */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Nome do Cliente <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="Ex: Ana Paula Semedo"
              {...register("customerName")}
              disabled={isSubmitting}
              className="h-10 rounded-xl"
            />
            {errors.customerName && (
              <p className="text-xs text-rose-600">{errors.customerName.message}</p>
            )}
          </div>

          {/* Telefone CV (+238) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Telemóvel (+238) <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <span className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-bold text-slate-700 shrink-0">
                🇨🇻 +238
              </span>
              <Input
                type="tel"
                placeholder="9912345"
                maxLength={7}
                {...register("customerPhone")}
                disabled={isSubmitting}
                className="h-10 rounded-xl flex-1"
              />
            </div>
            {errors.customerPhone && (
              <p className="text-xs text-rose-600">{errors.customerPhone.message}</p>
            )}
          </div>

          {/* Profissional */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Profissional <span className="text-rose-500">*</span>
            </label>
            <Select
              value={selectedEmployeeId}
              onValueChange={(val) => setValue("employeeId", val, { shouldValidate: true })}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.displayName} ({emp.role || "Especialista"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employeeId && (
              <p className="text-xs text-rose-600">{errors.employeeId.message}</p>
            )}
          </div>

          {/* Serviço */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Serviço <span className="text-rose-500">*</span>
            </label>
            <Select
              value={selectedServiceId}
              onValueChange={(val) => setValue("serviceId", val, { shouldValidate: true })}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((srv) => (
                  <SelectItem key={srv.id} value={srv.id}>
                    {srv.name} — {formatDuration(srv.durationMinutes)} ({formatCurrency(srv.price)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceId && (
              <p className="text-xs text-rose-600">{errors.serviceId.message}</p>
            )}
          </div>

          {/* Horário */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Hora de Início (08:00 - 18:30) <span className="text-rose-500">*</span>
            </label>
            <Input
              type="time"
              step="900"
              {...register("time")}
              disabled={isSubmitting}
              className="h-10 rounded-xl"
            />
            {errors.time && (
              <p className="text-xs text-rose-600">{errors.time.message}</p>
            )}
          </div>

          {/* Notas */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Observações (opcional)
            </label>
            <Input
              placeholder="Ex: Cadeira 02, preferência por corte à tesoura"
              {...register("notes")}
              disabled={isSubmitting}
              className="h-10 rounded-xl"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="brand"
              disabled={isSubmitting}
              className="rounded-xl min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A agendar...
                </>
              ) : (
                "Agendar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

