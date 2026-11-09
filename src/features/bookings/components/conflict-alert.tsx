"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils/datetime";
import type { SlotItem } from "../types/booking.types";

interface ConflictAlertProps {
  /** Start time that was just taken by someone else. */
  conflictedStart: string;
  /** Closest free slots, selectable with a single tap. */
  alternatives: SlotItem[];
  isLoading: boolean;
  onPick: (startTime: string) => void;
  onChangeDate: () => void;
}

/** Amber banner shown on HTTP 409 (slot-already-booked). The wizard state is never cleared. */
export function ConflictAlert({ conflictedStart, alternatives, isLoading, onPick, onChangeDate }: ConflictAlertProps) {
  return (
    <div role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        <div className="flex-1">
          <p className="font-bold">Ups! O horário das {formatTime(conflictedStart)} acabou de ser reservado por outro cliente.</p>
          <p className="mt-1 text-sm text-amber-900/80">
            Os seus dados foram mantidos. Escolha um dos horários livres abaixo para continuar.
          </p>
        </div>
      </div>

      <div className="mt-3">
        {isLoading ? (
          <div className="flex gap-2" aria-busy="true">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-11 w-20 animate-pulse rounded-full bg-amber-200/70" />
            ))}
          </div>
        ) : alternatives.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {alternatives.map((s) => (
              <button
                key={s.startTime}
                type="button"
                onClick={() => onPick(s.startTime)}
                className="min-h-[44px] min-w-[76px] rounded-full border border-amber-400 bg-white px-4 font-accent text-sm font-bold text-amber-900 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
              >
                {s.formattedTime}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm font-medium">Já não há mais horários livres neste dia.</p>
        )}
      </div>

      <Button type="button" variant="outline" size="sm" className="mt-3 min-h-[44px] border-amber-300" onClick={onChangeDate}>
        Escolher outra data
      </Button>
    </div>
  );
}
