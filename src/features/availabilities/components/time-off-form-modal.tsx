"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Clock,
  AlertCircle,
  Palmtree,
  Loader2,
  Check,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createTimeOffSchema,
  type CreateTimeOffFormData,
} from "../schemas/availability.schema";
import {
  TIME_OFF_TYPE_CONFIG,
  type CreateTimeOffPayload,
  type TimeOffType,
} from "../types/availability.types";

interface TimeOffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTimeOffPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export function TimeOffFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: TimeOffFormModalProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTimeOffFormData>({
    resolver: zodResolver(createTimeOffSchema),
    defaultValues: {
      type: "VACATION",
      startDate: todayStr,
      endDate: todayStr,
      isAllDay: true,
      startTime: "08:00",
      endTime: "13:00",
      note: "",
    },
  });

  const isAllDay = watch("isAllDay");
  const selectedType = watch("type");
  const startDate = watch("startDate");

  // Keep endDate >= startDate automatically when startDate changes
  useEffect(() => {
    const currentEndDate = watch("endDate");
    if (startDate && (!currentEndDate || currentEndDate < startDate)) {
      setValue("endDate", startDate);
    }
  }, [startDate, setValue, watch]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        type: "VACATION",
        startDate: todayStr,
        endDate: todayStr,
        isAllDay: true,
        startTime: "08:00",
        endTime: "13:00",
        note: "",
      });
    }
  }, [isOpen, reset, todayStr]);

  const onFormSubmit = async (data: CreateTimeOffFormData) => {
    const payload: CreateTimeOffPayload = {
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      isAllDay: data.isAllDay,
      startTime: data.isAllDay ? null : data.startTime,
      endTime: data.isAllDay ? null : data.endTime,
      note: data.note?.trim() || undefined,
    };
    await onSubmit(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-lg w-[95vw] rounded-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2.5 text-teal-700">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
              <Palmtree className="w-5 h-5 text-teal-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Registar Ausência ou Férias
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-slate-600 leading-relaxed">
            Bloqueie períodos em que o profissional não estará disponível para marcações.
            O motor de disponibilidade removerá automaticamente esses slots no marketplace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5 pt-2">
          {/* Proactive Conflict Impact Warning */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Atenção:</strong> Os horários selecionados ficarão imediatamente bloqueados no agendamento de clientes. Se houver agendamentos existentes neste período, será necessário contactar o cliente para reagendar.
            </p>
          </div>

          {/* Type of Absence */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Tipo de Ausência
            </label>
            <Select
              value={selectedType}
              onValueChange={(val) => setValue("type", val as TimeOffType)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full min-h-[44px] rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Selecione o tipo de ausência" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {Object.entries(TIME_OFF_TYPE_CONFIG).map(([key, item]) => (
                  <SelectItem key={key} value={key} className="py-2.5">
                    <span className="font-semibold text-slate-900">{item.label}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      {item.description}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-rose-600 font-medium">{errors.type.message}</p>
            )}
          </div>

          {/* Date Range: Start and End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                Data de Início
              </label>
              <Input
                type="date"
                {...register("startDate")}
                disabled={isSubmitting}
                className="min-h-[44px] rounded-xl border-slate-200 bg-white font-medium"
              />
              {errors.startDate && (
                <p className="text-xs text-rose-600 font-medium">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                Data de Fim
              </label>
              <Input
                type="date"
                min={startDate}
                {...register("endDate")}
                disabled={isSubmitting}
                className="min-h-[44px] rounded-xl border-slate-200 bg-white font-medium"
              />
              {errors.endDate && (
                <p className="text-xs text-rose-600 font-medium">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* All Day Toggle Switch */}
          <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-slate-900">
                Dia Inteiro de Ausência
              </span>
              <p className="text-xs text-slate-500">
                {isAllDay
                  ? "Bloqueia o dia completo de trabalho"
                  : "Bloqueia apenas uma faixa de horário pontual"}
              </p>
            </div>
            <Switch
              checked={isAllDay}
              onCheckedChange={(checked) => setValue("isAllDay", checked)}
              disabled={isSubmitting}
              className="data-[state=checked]:bg-teal-600"
            />
          </div>

          {/* Partial Hours (if not all day) */}
          {!isAllDay && (
            <div className="grid grid-cols-2 gap-4 p-3.5 bg-teal-50/40 border border-teal-100 rounded-xl animate-in fade-in">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  Hora Início
                </label>
                <Input
                  type="time"
                  {...register("startTime")}
                  disabled={isSubmitting}
                  className="min-h-[40px] rounded-xl bg-white text-center font-semibold"
                />
                {errors.startTime && (
                  <p className="text-[11px] text-rose-600">{errors.startTime.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  Hora Fim
                </label>
                <Input
                  type="time"
                  {...register("endTime")}
                  disabled={isSubmitting}
                  className="min-h-[40px] rounded-xl bg-white text-center font-semibold"
                />
                {errors.endTime && (
                  <p className="text-[11px] text-rose-600">{errors.endTime.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Note / Justification (optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Observação / Motivo (Opcional)
            </label>
            <Input
              {...register("note")}
              placeholder="Ex: Consulta médica de rotina, Férias de Natal..."
              maxLength={250}
              disabled={isSubmitting}
              className="min-h-[44px] rounded-xl border-slate-200 bg-white"
            />
            {errors.note && (
              <p className="text-xs text-rose-600 font-medium">{errors.note.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-h-[44px] rounded-xl text-slate-600"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  A Registar...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar e Bloquear Horários
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

