"use client";

import { cn } from "@/lib/utils";
import type { SlotItem } from "../types/booking.types";

interface SlotPickerProps {
  slots: SlotItem[];
  /** ISO start time of the selected slot. */
  selectedSlot?: string | null;
  isLoading: boolean;
  onSelectSlot: (startTime: string) => void;
  /** Start times to emphasise (suggested alternatives after a 409). */
  highlighted?: string[];
}

export function SlotPicker({ slots, selectedSlot, isLoading, onSelectSlot, highlighted = [] }: SlotPickerProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5" aria-busy="true" aria-label="A carregar horários">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="h-11 animate-pulse rounded-full bg-slate-200/80" />
        ))}
      </div>
    );
  }
  return (
    <div role="radiogroup" aria-label="Horários disponíveis" className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
      {slots.map((s) => {
        const selected = s.startTime === selectedSlot;
        return (
          <button
            key={s.startTime}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={!s.available}
            onClick={() => onSelectSlot(s.startTime)}
            className={cn(
              "min-h-[44px] rounded-full border px-3 font-accent text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-40",
              selected
                ? "border-perola-deep bg-perola-deep text-white shadow-sm"
                : highlighted.includes(s.startTime)
                  ? "border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100"
                  : "border-slate-200 bg-white text-slate-700 hover:border-perola-deep hover:bg-teal-50",
            )}
          >
            {s.formattedTime}
          </button>
        );
      })}
    </div>
  );
}
