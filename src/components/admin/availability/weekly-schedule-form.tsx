"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Plus,
  Trash2,
  Copy,
  Save,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Calendar,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DAY_OF_WEEK_LABELS,
  type DayOfWeek,
  type ScheduleBreak,
  type ScheduleDay,
  type WeeklySchedule,
} from "@/types/availability";

const ORDERED_DAYS: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DEFAULT_SCHEDULE_DAYS: ScheduleDay[] = [
  {
    dayOfWeek: "MONDAY",
    isWorking: true,
    startTime: "08:00",
    endTime: "18:00",
    breaks: [{ name: "Almoço", startTime: "12:30", endTime: "13:30" }],
  },
  {
    dayOfWeek: "TUESDAY",
    isWorking: true,
    startTime: "08:00",
    endTime: "18:00",
    breaks: [{ name: "Almoço", startTime: "12:30", endTime: "13:30" }],
  },
  {
    dayOfWeek: "WEDNESDAY",
    isWorking: true,
    startTime: "08:00",
    endTime: "18:00",
    breaks: [{ name: "Almoço", startTime: "12:30", endTime: "13:30" }],
  },
  {
    dayOfWeek: "THURSDAY",
    isWorking: true,
    startTime: "08:00",
    endTime: "18:00",
    breaks: [{ name: "Almoço", startTime: "12:30", endTime: "13:30" }],
  },
  {
    dayOfWeek: "FRIDAY",
    isWorking: true,
    startTime: "08:00",
    endTime: "18:00",
    breaks: [{ name: "Almoço", startTime: "12:30", endTime: "13:30" }],
  },
  {
    dayOfWeek: "SATURDAY",
    isWorking: true,
    startTime: "09:00",
    endTime: "16:00",
    breaks: [],
  },
  {
    dayOfWeek: "SUNDAY",
    isWorking: false,
    startTime: null,
    endTime: null,
    breaks: [],
  },
];

interface WeeklyScheduleFormProps {
  initialSchedule?: WeeklySchedule | null;
  onSave: (payload: { name: string; isDefault: boolean; days: ScheduleDay[] }) => Promise<void>;
  isSaving?: boolean;
}

export function WeeklyScheduleForm({
  initialSchedule,
  onSave,
  isSaving = false,
}: WeeklyScheduleFormProps) {
  const [name, setName] = useState<string>(initialSchedule?.name || "Horário Padrão");
  const [isDefault, setIsDefault] = useState<boolean>(initialSchedule?.isDefault ?? true);
  const [days, setDays] = useState<ScheduleDay[]>(() => {
    if (initialSchedule && initialSchedule.days && initialSchedule.days.length > 0) {
      // Ensure all 7 days are represented in proper order
      return ORDERED_DAYS.map((dow) => {
        const found = initialSchedule.days.find((d) => d.dayOfWeek === dow);
        if (found) return { ...found, breaks: found.breaks || [] };
        return {
          dayOfWeek: dow,
          isWorking: false,
          startTime: null,
          endTime: null,
          breaks: [],
        };
      });
    }
    return DEFAULT_SCHEDULE_DAYS;
  });

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [addingBreakDay, setAddingBreakDay] = useState<DayOfWeek | null>(null);
  const [newBreakName, setNewBreakName] = useState<string>("Almoço");
  const [newBreakStart, setNewBreakStart] = useState<string>("12:30");
  const [newBreakEnd, setNewBreakEnd] = useState<string>("13:30");

  useEffect(() => {
    if (initialSchedule) {
      setName(initialSchedule.name || "Horário Padrão");
      setIsDefault(initialSchedule.isDefault ?? true);
      if (initialSchedule.days && initialSchedule.days.length > 0) {
        setDays(
          ORDERED_DAYS.map((dow) => {
            const found = initialSchedule.days.find((d) => d.dayOfWeek === dow);
            if (found) return { ...found, breaks: found.breaks || [] };
            return {
              dayOfWeek: dow,
              isWorking: false,
              startTime: null,
              endTime: null,
              breaks: [],
            };
          }),
        );
      }
      setIsDirty(false);
    }
  }, [initialSchedule]);

  // Toggle day working status
  const toggleDayWorking = (dayOfWeek: DayOfWeek, isWorking: boolean) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek === dayOfWeek) {
          return {
            ...d,
            isWorking,
            startTime: isWorking ? d.startTime || "08:00" : null,
            endTime: isWorking ? d.endTime || "18:00" : null,
          };
        }
        return d;
      }),
    );
    setIsDirty(true);
  };

  // Update working hours
  const updateDayTimes = (
    dayOfWeek: DayOfWeek,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek === dayOfWeek) {
          return { ...d, [field]: value };
        }
        return d;
      }),
    );
    setIsDirty(true);
  };

  // Add break to a day
  const handleAddBreak = (dayOfWeek: DayOfWeek) => {
    if (!newBreakStart || !newBreakEnd) {
      toast.error("Indique o horário de início e fim da pausa.");
      return;
    }
    if (newBreakEnd <= newBreakStart) {
      toast.error("A hora de fim da pausa deve ser posterior à hora de início.");
      return;
    }

    const day = days.find((d) => d.dayOfWeek === dayOfWeek);
    if (day && day.startTime && day.endTime) {
      if (newBreakStart < day.startTime || newBreakEnd > day.endTime) {
        toast.error(
          `A pausa deve estar dentro do horário de trabalho (${day.startTime} - ${day.endTime}).`,
        );
        return;
      }
    }

    const newBreak: ScheduleBreak = {
      name: newBreakName.trim() || "Pausa",
      startTime: newBreakStart,
      endTime: newBreakEnd,
    };

    setDays((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek === dayOfWeek) {
          return {
            ...d,
            breaks: [...(d.breaks || []), newBreak],
          };
        }
        return d;
      }),
    );

    setAddingBreakDay(null);
    setNewBreakName("Almoço");
    setNewBreakStart("12:30");
    setNewBreakEnd("13:30");
    setIsDirty(true);
    toast.success("Intervalo adicionado!");
  };

  // Delete break
  const handleDeleteBreak = (dayOfWeek: DayOfWeek, index: number) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek === dayOfWeek) {
          const updatedBreaks = [...(d.breaks || [])];
          updatedBreaks.splice(index, 1);
          return { ...d, breaks: updatedBreaks };
        }
        return d;
      }),
    );
    setIsDirty(true);
  };

  // Productivity Action: Copy Monday to Weekdays (Tue-Fri)
  const copyMondayToWeekdays = () => {
    const monday = days.find((d) => d.dayOfWeek === "MONDAY");
    if (!monday) return;

    const weekdaysTarget: DayOfWeek[] = ["TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

    setDays((prev) =>
      prev.map((d) => {
        if (weekdaysTarget.includes(d.dayOfWeek)) {
          return {
            ...d,
            isWorking: monday.isWorking,
            startTime: monday.startTime,
            endTime: monday.endTime,
            breaks: (monday.breaks || []).map((b) => ({ ...b })),
          };
        }
        return d;
      }),
    );

    setIsDirty(true);
    toast.success("Horário de Segunda-feira copiado para Terça a Sexta!");
  };

  // Recommended CV Schedule quick apply
  const applyRecommendedSchedule = () => {
    setDays(DEFAULT_SCHEDULE_DAYS);
    setName("Horário Padrão");
    setIsDefault(true);
    setIsDirty(true);
    toast.success("Expediente recomendado de Cabo Verde aplicado!");
  };

  // Submit Handler with full validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Indique um nome para o perfil de horário semanal.");
      return;
    }

    // Validate days
    for (const d of days) {
      if (d.isWorking) {
        if (!d.startTime || !d.endTime) {
          toast.error(
            `Indique o início e fim de expediente para ${DAY_OF_WEEK_LABELS[d.dayOfWeek].full}.`,
          );
          return;
        }
        if (d.endTime <= d.startTime) {
          toast.error(
            `A hora de saída deve ser após a hora de entrada em ${DAY_OF_WEEK_LABELS[d.dayOfWeek].full}.`,
          );
          return;
        }

        if (d.breaks) {
          for (const b of d.breaks) {
            if (b.startTime < d.startTime || b.endTime > d.endTime) {
              toast.error(
                `A pausa '${b.name}' em ${DAY_OF_WEEK_LABELS[d.dayOfWeek].full} deve estar contida dentro do expediente (${d.startTime} - ${d.endTime}).`,
              );
              return;
            }
          }
        }
      }
    }

    await onSave({
      name: name.trim(),
      isDefault,
      days,
    });
    setIsDirty(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Header Settings & Quick Actions */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              Perfil de Expediente Semanal
            </h3>
            <p className="text-xs text-slate-500">
              Configure os 7 dias de trabalho e as pausas de almoço. Este perfil define a grade de slots de atendimento.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={applyRecommendedSchedule}
              className="text-xs min-h-[40px] text-slate-700 rounded-xl border-slate-200 hover:bg-slate-50"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
              Aplicar Sugestão Padrão CV
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyMondayToWeekdays}
              className="text-xs min-h-[40px] text-teal-700 bg-teal-50/50 rounded-xl border-teal-200 hover:bg-teal-100 hover:text-teal-800 font-semibold"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copiar 2ª para Dias Úteis (Ter-Sex)
            </Button>
          </div>
        </div>

        {/* Profile Name & Default Switch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Nome do Perfil de Horário
            </label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Ex: Horário Padrão, Horário de Verão..."
              className="min-h-[44px] rounded-xl border-slate-200 bg-slate-50/30"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 sm:pt-6">
            <span className="text-xs sm:text-sm font-medium text-slate-700">
              Definir como Horário Padrão do Salão
            </span>
            <Switch
              checked={isDefault}
              onCheckedChange={(checked) => {
                setIsDefault(checked);
                setIsDirty(true);
              }}
              className="data-[state=checked]:bg-teal-600"
            />
          </div>
        </div>
      </div>

      {/* 7 Days of the Week List */}
      <div className="space-y-3">
        {days.map((day) => {
          const dayMeta = DAY_OF_WEEK_LABELS[day.dayOfWeek];
          const isAddingBreak = addingBreakDay === day.dayOfWeek;

          return (
            <Card
              key={day.dayOfWeek}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                day.isWorking
                  ? "bg-white border-slate-200/90 shadow-2xs hover:border-teal-200"
                  : "bg-slate-50/60 border-slate-200/50 opacity-80"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Day Identifier & Working Toggle */}
                <div className="flex items-center justify-between lg:justify-start gap-4 min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        day.isWorking
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {dayMeta.short}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {dayMeta.full}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {day.isWorking ? "Dia de Atendimento" : "Folga Regular"}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center gap-2 lg:ml-2">
                    <Switch
                      checked={day.isWorking}
                      onCheckedChange={(checked) => toggleDayWorking(day.dayOfWeek, checked)}
                      className="data-[state=checked]:bg-teal-600"
                    />
                  </div>
                </div>

                {/* Working Hours Input Fields */}
                {day.isWorking ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:flex-1 lg:justify-end">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Turno:</span>
                      <Input
                        type="time"
                        value={day.startTime || "08:00"}
                        onChange={(e) =>
                          updateDayTimes(day.dayOfWeek, "startTime", e.target.value)
                        }
                        className="w-28 min-h-[40px] text-center font-semibold rounded-xl border-slate-200 bg-white"
                      />
                      <span className="text-xs text-slate-400 font-bold">às</span>
                      <Input
                        type="time"
                        value={day.endTime || "18:00"}
                        onChange={(e) =>
                          updateDayTimes(day.dayOfWeek, "endTime", e.target.value)
                        }
                        className="w-28 min-h-[40px] text-center font-semibold rounded-xl border-slate-200 bg-white"
                      />
                    </div>

                    {/* Break Action Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setAddingBreakDay(isAddingBreak ? null : day.dayOfWeek)
                      }
                      className="min-h-[40px] rounded-xl text-teal-700 hover:bg-teal-50 font-medium text-xs px-2.5"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Adicionar Pausa
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end lg:flex-1">
                    <Badge
                      variant="outline"
                      className="bg-slate-100 text-slate-500 border-slate-200 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      FOLGA SEMANAL
                    </Badge>
                  </div>
                )}
              </div>

              {/* Breaks and Lunch List */}
              {day.isWorking && (day.breaks?.length > 0 || isAddingBreak) && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase text-slate-400 flex items-center gap-1 mr-1">
                      <Coffee className="w-3 h-3 text-amber-600" />
                      Pausas:
                    </span>
                    {day.breaks?.map((b, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs px-2.5 py-1 rounded-lg font-medium"
                      >
                        <span>
                          {b.name}: <strong>{b.startTime} - {b.endTime}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteBreak(day.dayOfWeek, idx)}
                          className="hover:text-rose-600 text-amber-700/80 p-0.5 rounded transition-colors"
                          title="Remover pausa"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Inline Form to add a new pause */}
                  {isAddingBreak && (
                    <div className="p-3 bg-teal-50/40 border border-teal-100 rounded-xl flex flex-wrap items-center gap-2.5 text-xs animate-in fade-in">
                      <span className="font-semibold text-teal-900">Nova Pausa:</span>
                      <Input
                        type="text"
                        placeholder="Nome (ex: Almoço)"
                        value={newBreakName}
                        onChange={(e) => setNewBreakName(e.target.value)}
                        className="h-8 w-28 text-xs rounded-lg bg-white"
                      />
                      <Input
                        type="time"
                        value={newBreakStart}
                        onChange={(e) => setNewBreakStart(e.target.value)}
                        className="h-8 w-24 text-xs text-center rounded-lg bg-white"
                      />
                      <span className="text-slate-400">às</span>
                      <Input
                        type="time"
                        value={newBreakEnd}
                        onChange={(e) => setNewBreakEnd(e.target.value)}
                        className="h-8 w-24 text-xs text-center rounded-lg bg-white"
                      />
                      <div className="flex items-center gap-1.5 ml-auto">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setAddingBreakDay(null)}
                          className="h-8 text-xs text-slate-600"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleAddBreak(day.dayOfWeek)}
                          className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-3"
                        >
                          Confirmar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
          {isDirty ? (
            <span className="text-amber-700 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Tem alterações não gravadas no expediente semanal.
            </span>
          ) : (
            <span className="text-emerald-700 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Todas as configurações estão salvas e ativas.
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition-all px-6"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              A Salvar Expediente...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Expediente Semanal
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

