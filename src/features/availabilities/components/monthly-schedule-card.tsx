"use client";

import React from "react";
import { Calendar, CheckCircle2, AlertCircle, Clock, Sparkles } from "lucide-react";
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
}

export function MonthlyScheduleCard({
  year,
  month,
  schedule,
  holidays,
  onOpenClick,
  isCurrentMonth = false,
}: MonthlyScheduleCardProps) {
  const monthName = MONTH_NAMES[month - 1];
  const isOpened = Boolean(schedule?.isOpened);

  // Month-specific holidays
  const monthHolidays = (holidays || []).filter((h) => {
    const rawDate = h?.date || h?.holidayDate || "";
    if (!rawDate || typeof rawDate !== "string") return false;
    const parts = rawDate.split("-");
    return parts.length >= 2 && parseInt(parts[1], 10) === month;
  });

  return (
    <Card
      className={`relative overflow-hidden border p-5 sm:p-6 rounded-2xl transition-all duration-200 ${isOpened
        ? "bg-white border-slate-200/80 shadow-xs hover:border-teal-200"
        : "bg-amber-50/20 border-amber-200/60 shadow-xs hover:border-amber-300"
        }`}
    >
      {/* Top Banner Ribbon for Current Month */}
      {isCurrentMonth && (
        <div className="absolute top-0 right-0 bg-teal-600 text-white text-[11px] font-semibold px-3 py-1 rounded-bl-xl tracking-wider uppercase flex items-center gap-1 shadow-xs">
          <Sparkles className="w-3 h-3" /> Mês Atual
        </div>
      )}

      {/* Header with Month Title and Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${isOpened
              ? "bg-teal-50 text-teal-700 border border-teal-100"
              : "bg-amber-100/60 text-amber-800 border border-amber-200/80"
              }`}
          >
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {monthName} {year}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {isOpened
                ? `Horário: ${schedule?.scheduleName || "Expediente Padrão"}`
                : "Ainda sem expediente mensal ativo"}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isOpened ? (
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-800 border-emerald-200/80 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              AGENDA ABERTA
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-amber-100/80 text-amber-900 border-amber-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              AGENDA FECHADA
            </Badge>
          )}
        </div>
      </div>

      {/* Operational Highlights */}
      <div className="space-y-2.5 py-3 border-y border-slate-100 my-4 text-sm text-slate-600">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            Estado para marcações:
          </span>
          <span className="font-semibold text-slate-800">
            {isOpened ? "Visível a Clientes no Marketplace" : "Bloqueado para Agendamentos"}
          </span>
        </div>

        {/* Holidays Notice */}
        <div className="flex items-start justify-between text-xs sm:text-sm pt-1">
          <span className="text-slate-500">Feriados em Cabo Verde:</span>
          <span className="font-medium text-right text-slate-700 max-w-[65%]">
            {monthHolidays.length > 0 ? (
              <span className="inline-flex flex-wrap gap-1 justify-end">
                {monthHolidays.map((h, idx) => {
                  const dateStr = h.date || h.holidayDate || `holiday-${idx}`;
                  return (
                    <span
                      key={dateStr}
                      className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium"
                      title={dateStr}
                    >
                      {h.name}
                    </span>
                  );
                })}
              </span>
            ) : (
              <span className="text-slate-400 italic">Nenhum feriado oficial</span>
            )}
          </span>
        </div>

        {schedule?.openedAt && (
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Abertura registada em:</span>
            <span>{new Date(schedule.openedAt).toLocaleDateString("pt-CV")}</span>
          </div>
        )}
      </div>

      {/* Bottom CTA Action */}
      <div className="pt-1 flex items-center justify-end">
        {isOpened ? (
          <Button
            type="button"
            variant="outline"
            onClick={onOpenClick}
            className="w-full sm:w-auto min-h-[44px] rounded-xl text-teal-700 border-teal-200 hover:bg-teal-50 hover:text-teal-800 font-semibold text-sm"
          >
            Reconfigurar Feriados
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onOpenClick}
            className="w-full sm:w-auto min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Abrir Agenda de {monthName}
          </Button>
        )}
      </div>
    </Card>
  );
}

