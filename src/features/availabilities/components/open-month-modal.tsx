"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Sparkles,
  Info,
  Check,
  AlertTriangle,
  Loader2,
  Briefcase,
  X,
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MONTH_NAMES,
  type Holiday,
  type HolidayDecision,
  type OpenMonthRequest,
  type WeeklySchedule,
} from "../types/availability.types";

interface OpenMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number; // 1-12
  holidays: Holiday[];
  weeklySchedules: WeeklySchedule[];
  onConfirm: (payload: OpenMonthRequest) => Promise<void>;
  isSubmitting?: boolean;
}

export function OpenMonthModal({
  isOpen,
  onClose,
  year,
  month,
  holidays,
  weeklySchedules,
  onConfirm,
  isSubmitting = false,
}: OpenMonthModalProps) {
  const monthName = MONTH_NAMES[month - 1] || "Mês";

  // Filter holidays belonging to this specific month
  const monthHolidays = (holidays || []).filter((h) => {
    const rawDate = h?.date || h?.holidayDate || "";
    if (!rawDate || typeof rawDate !== "string") return false;
    const parts = rawDate.split("-");
    return parts.length >= 2 && parseInt(parts[1], 10) === month;
  });

  // Selected schedule profile template
  const defaultScheduleId =
    weeklySchedules.find((s) => s.isDefault)?.id || weeklySchedules[0]?.id || "";
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(defaultScheduleId);

  // Holiday decisions map: holidayDate -> workOnHoliday (boolean)
  const [holidayDecisions, setHolidayDecisions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (defaultScheduleId && !selectedScheduleId) {
      setSelectedScheduleId(defaultScheduleId);
    }
  }, [defaultScheduleId, selectedScheduleId]);

  // Reset or initialize holiday decisions to FALSE (standard: take holiday off)
  useEffect(() => {
    const initialDecisions: Record<string, boolean> = {};
    monthHolidays.forEach((h) => {
      const dateKey = h.date || h.holidayDate;
      if (dateKey) {
        initialDecisions[dateKey] = false;
      }
    });
    setHolidayDecisions(initialDecisions);
  }, [month, holidays]);

  const toggleHoliday = (date: string, value: boolean) => {
    setHolidayDecisions((prev) => ({
      ...prev,
      [date]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheduleId) return;

    const decisionsList: HolidayDecision[] = Object.entries(holidayDecisions).map(
      ([holidayDate, workOnHoliday]) => ({
        holidayDate,
        workOnHoliday,
      }),
    );

    await onConfirm({
      scheduleId: selectedScheduleId,
      year,
      month,
      holidayDecisions: decisionsList,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-lg w-[95vw] rounded-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2.5 text-teal-700">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Abertura de Agenda — {monthName} {year}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-slate-600 leading-relaxed">
            A abertura mensal é mandatória no Pérola para disponibilizar os slots de atendimento aos clientes
            no marketplace durante todo o mês de <strong>{monthName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Informational Callout */}
          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-100/80 flex items-start gap-3 text-xs sm:text-sm text-teal-900">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              Ao confirmar, a sua rotina semanal selecionada entrará em vigor em todos os dias úteis deste mês.
            </p>
          </div>

          {/* Schedule Template Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-teal-600" />
              Perfil de Expediente Semanal a Aplicar
            </label>
            {weeklySchedules.length > 0 ? (
              <Select
                value={selectedScheduleId}
                onValueChange={setSelectedScheduleId}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full min-h-[44px] rounded-xl border-slate-200 bg-white">
                  <SelectValue placeholder="Selecione o perfil de horário" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {weeklySchedules.map((schedule) => (
                    <SelectItem key={schedule.id} value={schedule.id} className="py-2.5">
                      <span className="font-semibold text-slate-900">{schedule.name}</span>
                      {schedule.isDefault && (
                        <span className="ml-2 text-xs text-teal-600 font-medium bg-teal-50 px-1.5 py-0.5 rounded">
                          Padrão
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                A utilizar o perfil predefinido do salão (Segunda a Sábado, 08:00 - 18:00).
              </div>
            )}
          </div>

          {/* Cape Verde Holidays Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Feriados Oficiais em Cabo Verde ({monthHolidays.length})
              </label>
            </div>

            {monthHolidays.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500 bg-slate-50/50">
                Não há feriados nacionais oficiais registados em {monthName}.
              </div>
            ) : (
              <div className="space-y-3">
                {monthHolidays.map((holiday, idx) => {
                  const dateKey = holiday.date || holiday.holidayDate || `holiday-${idx}`;
                  const willWork = Boolean(holidayDecisions[dateKey]);
                  const formattedDate = dateKey.includes("-")
                    ? new Date(`${dateKey}T00:00:00`).toLocaleDateString("pt-CV", {
                        day: "2-digit",
                        month: "long",
                        weekday: "short",
                      })
                    : holiday.name;

                  return (
                    <div
                      key={dateKey}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                        willWork
                          ? "bg-teal-50/30 border-teal-200"
                          : "bg-slate-50/80 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold uppercase text-teal-700 tracking-wide">
                            {formattedDate}
                          </div>
                          <div className="text-sm font-bold text-slate-900 mt-0.5">
                            {holiday.name}
                          </div>
                        </div>

                        {/* Work on holiday toggle switch */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-medium text-slate-600">
                            {willWork ? "Trabalhar" : "Folgar"}
                          </span>
                          <Switch
                            checked={willWork}
                            onCheckedChange={(checked) => toggleHoliday(dateKey, checked)}
                            disabled={isSubmitting}
                            className="data-[state=checked]:bg-teal-600"
                          />
                        </div>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                        {willWork ? (
                          <span className="text-teal-700 font-medium">
                            ✓ O expediente regular deste dia permanecerá ativo para agendamentos.
                          </span>
                        ) : (
                          <span className="text-slate-600">
                            🔒 O sistema criará automaticamente um bloqueio de folga de feriado.
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-h-[44px] rounded-xl text-slate-600 border-slate-200 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || (weeklySchedules.length > 0 && !selectedScheduleId)}
              className="min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  A Abrir Agenda...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar e Abrir Agenda
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

