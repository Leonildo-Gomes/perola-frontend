"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Trash2,
  AlertTriangle,
  Palmtree,
  FileText,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TIME_OFF_TYPE_CONFIG,
  type EmployeeTimeOff,
} from "@/types/availability";

interface TimeOffCardProps {
  timeOff: EmployeeTimeOff;
  onDelete: (id: string) => Promise<void>;
  isDeleting?: boolean;
}

export function TimeOffCard({ timeOff, onDelete, isDeleting = false }: TimeOffCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const config =
    TIME_OFF_TYPE_CONFIG[timeOff.type] || TIME_OFF_TYPE_CONFIG.OTHER;

  // Check if today falls in [startDate, endDate]
  const todayStr = new Date().toISOString().split("T")[0];
  const isToday =
    todayStr >= timeOff.startDate && todayStr <= timeOff.endDate;

  // Check if it is a past absence
  const isPast = timeOff.endDate < todayStr;

  // Format date range
  const formatCVDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    return date.toLocaleDateString("pt-CV", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate duration in days
  const calculateDays = () => {
    const start = new Date(timeOff.startDate).getTime();
    const end = new Date(timeOff.endDate).getTime();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const daysCount = calculateDays();

  const handleDelete = async () => {
    await onDelete(timeOff.id);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <Card
        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
          isToday
            ? "bg-amber-50/40 border-amber-300 shadow-sm"
            : isPast
            ? "bg-slate-50/70 border-slate-200/60 opacity-75"
            : "bg-white border-slate-200/90 shadow-2xs hover:border-teal-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          {/* Left Details */}
          <div className="space-y-2.5">
            {/* Header with badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.badgeClasses}`}
              >
                {config.label}
              </Badge>

              {isToday && (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
                  FOLGA HOJE
                </Badge>
              )}

              {isPast && (
                <Badge
                  variant="outline"
                  className="bg-slate-100 text-slate-500 border-slate-200 text-[11px] font-medium px-2 py-0.5 rounded-full"
                >
                  Concluída
                </Badge>
              )}

              <span className="text-xs font-medium text-slate-500">
                {timeOff.isAllDay ? (
                  `${daysCount} ${daysCount === 1 ? "dia" : "dias"}`
                ) : (
                  <span className="inline-flex items-center gap-1 text-teal-700 font-semibold">
                    <Clock className="w-3 h-3" />
                    Parcial ({timeOff.startTime} - {timeOff.endTime})
                  </span>
                )}
              </span>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg tracking-tight">
              <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                {formatCVDate(timeOff.startDate)}
                {timeOff.startDate !== timeOff.endDate && (
                  <>
                    <span className="text-slate-400 mx-1.5 font-normal">até</span>
                    {formatCVDate(timeOff.endDate)}
                  </>
                )}
              </span>
            </div>

            {/* Note / Reason if present */}
            {timeOff.note && (
              <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-2.5 max-w-xl">
                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <p className="italic leading-relaxed">{timeOff.note}</p>
              </div>
            )}
          </div>

          {/* Right Action: Delete Button */}
          <div className="flex items-center justify-end sm:self-center shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsConfirmOpen(true)}
              disabled={isDeleting}
              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl min-h-[40px] px-3 text-xs font-medium"
              title="Remover bloqueio de agenda"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Remover
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirmation Modal Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-md w-[95vw] rounded-2xl p-6">
          <DialogHeader className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Remover Bloqueio de Ausência?
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              Ao remover esta folga ({formatCVDate(timeOff.startDate)}), os horários correspondentes
              voltarão a ficar imediatamente disponíveis para novos agendamentos de clientes.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isDeleting}
              className="min-h-[44px] rounded-xl text-slate-600"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="min-h-[44px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  A remover...
                </>
              ) : (
                "Sim, Remover Bloqueio"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

