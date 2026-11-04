"use client";

import * as React from "react";

/** "9912345" → "991 23 45" */
function formatCvPhone(digits: string): string {
  const d = digits.slice(0, 7);
  return [d.slice(0, 3), d.slice(3, 5), d.slice(5, 7)].filter(Boolean).join(" ");
}

interface PhoneInputCVProps {
  id: string;
  /** National digits only (7 max), no prefix. */
  value: string;
  onChange: (digits: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}

export const PhoneInputCV = React.forwardRef<HTMLInputElement, PhoneInputCVProps>(
  ({ id, value, onChange, onBlur, disabled, invalid, describedBy }, ref) => (
    <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-white transition-colors focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600">
      <span className="flex shrink-0 items-center gap-1.5 pl-3.5 pr-3 font-accent text-sm font-semibold text-slate-700" aria-hidden>
        <span>🇨🇻</span>+238
      </span>
      <span aria-hidden className="h-6 w-px bg-slate-200" />
      <input
        ref={ref}
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="991 23 45"
        value={formatCvPhone(value)}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 7))}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-label="Telemóvel (prefixo +238)"
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
      />
    </div>
  ),
);
PhoneInputCV.displayName = "PhoneInputCV";
