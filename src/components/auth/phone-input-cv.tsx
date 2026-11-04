"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

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
    <div className="flex items-stretch gap-2">
      <span
        className="flex h-12 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 font-accent text-sm font-medium text-slate-700"
        aria-hidden
      >
        <span>🇨🇻</span>+238
      </span>
      <Input
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
      />
    </div>
  ),
);
PhoneInputCV.displayName = "PhoneInputCV";
