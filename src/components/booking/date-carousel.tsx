"use client";

import { useEffect, useRef } from "react";
import { formatDayNumber, formatKeyLong, formatMonthShort, formatWeekdayShort } from "@/lib/datetime";
import { cn } from "@/lib/utils";

interface DateCarouselProps {
  /** `YYYY-MM-DD` keys (Cape Verde). */
  dates: string[];
  selected: string;
  onSelect: (date: string) => void;
  /** Dates known to have no availability are disabled. */
  disabledDates?: string[];
}

export function DateCarousel({ dates, selected, onSelect, disabledDates = [] }: DateCarouselProps) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <div
      role="radiogroup"
      aria-label="Escolher data"
      className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {dates.map((d, i) => {
        const isSelected = d === selected;
        const disabled = disabledDates.includes(d);
        return (
          <button
            key={d}
            ref={isSelected ? selectedRef : undefined}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${formatKeyLong(d)}${disabled ? " (sem disponibilidade)" : ""}`}
            disabled={disabled}
            onClick={() => onSelect(d)}
            className={cn(
              "flex min-h-[72px] min-w-[60px] shrink-0 snap-start flex-col items-center justify-center gap-0.5 rounded-2xl border px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40",
              isSelected
                ? "border-perola-deep bg-perola-deep text-white shadow-md shadow-perola-deep/15"
                : "border-slate-200 bg-white text-slate-700 hover:border-perola-deep hover:bg-teal-50",
            )}
          >
            <span className={cn("text-xs font-medium capitalize", isSelected ? "text-white/80" : "text-slate-500")}>
              {i === 0 ? "Hoje" : formatWeekdayShort(d)}
            </span>
            <span className="font-accent text-xl font-extrabold leading-none">{formatDayNumber(d)}</span>
            <span className={cn("text-[11px] capitalize", isSelected ? "text-white/80" : "text-slate-500")}>
              {formatMonthShort(d)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
