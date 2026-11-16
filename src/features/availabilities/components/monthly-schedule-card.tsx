"use client";

import React, { useMemo } from "react";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MONTH_NAMES, type Holiday, type MonthlySchedule } from "../types/availability.types";

interface MonthlyScheduleCardProps {
  year: number;
  month: number; // 1-12
  schedule?: MonthlySchedule | null;
  holidays: Holiday[];
  onOpenClick: () => void;
  isCurrentMonth?: boolean;
  isPast?: boolean;
}

export function MonthlyScheduleCard({
  year,
  month,
  schedule,
  holidays,
  onOpenClick,
  isCurrentMonth = false,
  isPast = false,
}: MonthlyScheduleCardProps) {
  const monthName = MONTH_NAMES[month - 1];

  // Robust boolean check across all serialization formats
  const isOpened = Boolean(
    schedule?.isOpened ??
    (schedule as any)?.opened ??
    (schedule as any)?.is_opened ??
    ((schedule as any)?.status === "OPENED")
  );

  // Month-specific holidays (filtered strictly by year/month and deduplicated)
  const monthHolidays = useMemo(() => {
    const seenDates = new Set<string>();

    return (holidays || []).filter((h) => {
      const rawDate = h?.date || h?.holidayDate || "";
      if (!rawDate || typeof rawDate !== "string") return false;

      const parts = rawDate.split("-");
      if (parts.length < 3) return false;

      const holidayYear = parseInt(parts[0], 10);
      const holidayMonth = parseInt(parts[1], 10);

      const matchesCurrentMonth = holidayYear === year && holidayMonth === month;
      if (!matchesCurrentMonth) return false;

      if (seenDates.has(rawDate)) return false;
      seenDates.add(rawDate);

      return true;
    });
  }, [holidays, year, month]);

  const formatOpenedDate = (isoString?: string | null) => {
    if (!isoString) return null;
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat("pt-CV", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return null;
    }
  };

  const openedDateFormatted = formatOpenedDate(schedule?.openedAt);

  return (
    <Card
      className={`relative overflow-hidden border p-5 sm:p-6 rounded-2xl transition-all duration-200 flex flex-col justify-between ${
        isOpened
          ? "bg-white border-slate-200/80 shadow-xs hover:border-teal-300"
          : isPast
          ? "bg-slate-50/60 border-slate-200/60 opacity-70 shadow-none"
          : "bg-white border-slate-200/80 shadow-xs hover:border-amber-300"
      }`}
    >
      {/* Top Banner Ribbon for Current Month */}
      {isCurrentMonth && (
        <div className="absolute top-0 right-0 bg-teal-600 text-white text-[11px] font-semibold px-3 py-1 rounded-bl-xl tracking-wider uppercase flex items-center gap-1 shadow-xs z-10">
          <Sparkles className="w-3 h-3" /> Mês Atual
        </div>
      )}

      {/* Header with Month Title and Status Badge */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                isOpened
                  ? "bg-teal-50 text-teal-700 border border-teal-100"
                  : isPast
                  ? "bg-slate-100 text-slate-500 border border-slate-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200/80"
              }`}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                {isCurrentMonth ? "Mês Corrente" : isPast ? "Histórico" : "Planeamento"}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {monthName} {year}
              </h3>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {isOpened ? (
              <Badge
                variant="outline"
                className="bg-teal-50 text-teal-800 border-teal-200/80 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs uppercase tracking-wider"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
                AGENDA ABERTA
              </Badge>
            ) : isPast ? (
              <Badge
                variant="outline"
                className="bg-slate-100 text-slate-600 border-slate-300 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
              >
                ENCERRADO
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-amber-100/80 text-amber-900 border-amber-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs uppercase tracking-wider"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                AGENDA FECHADA
              </Badge>
            )}
          </div>
        </div>

        {/* Operational Highlights */}
        <div className="space-y-3 py-3 border-y border-slate-100 my-4 text-xs sm:text-sm">
          {/* Active Schedule details (if opened) */}
          {isOpened ? (
            <div className="space-y-2">
              <div className="bg-teal-50/70 border border-teal-100/90 rounded-xl p-3 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-teal-950 block">
                    Rotina: {schedule?.scheduleName || "Expediente Padrão"}
                  </span>
                  <span className="text-teal-700">
                    Visível a clientes no marketplace para marcações online
                  </span>
                </div>
              </div>

              {openedDateFormatted && (
                <div className="text-[11px] text-slate-400 flex items-center gap-1 px-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Aberta em: {openedDateFormatted}</span>
                </div>
              )}
            </div>
          ) : (
            /* Closed Schedule Notice with Holiday Detect */
            <div className="space-y-2">
              {monthHolidays.length > 0 ? (
                <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-3 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-amber-900 block">
                      {monthHolidays.length === 1
                        ? "1 feriado nacional detetado"
                        : `${monthHolidays.length} feriados nacionais detetados`}
                    </span>
                    <span className="text-amber-700 font-medium">
                      {monthHolidays.map((h) => h.name).join(", ")}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-xs text-slate-500">
                  Sem feriados nacionais oficiais em {monthName}.
                </div>
              )}

              <p className="text-[11px] text-slate-500 px-1 leading-relaxed">
                Requer abertura mandatória para disponibilizar horários deste mês aos clientes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA Action */}
      <div className="pt-2">
        {isOpened ? (
          <Button
            type="button"
            variant="outline"
            onClick={onOpenClick}
            className="w-full min-h-[44px] rounded-xl text-teal-700 border-teal-200 hover:bg-teal-50 hover:text-teal-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Reconfigurar Feriados
          </Button>
        ) : isPast ? (
          <div className="text-center py-2 text-xs text-slate-400 font-medium">
            Período encerrado para agendamentos
          </div>
        ) : (
          <Button
            type="button"
            onClick={onOpenClick}
            className="w-full min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Abrir Agenda de {monthName}
          </Button>
        )}
      </div>
    </Card>
  );
}
