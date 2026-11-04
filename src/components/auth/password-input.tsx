"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { Input, type InputProps } from "@/components/ui/input";

export const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    return (
      <div className="relative">
        <Input ref={ref} type={visible ? "text" : "password"} className={`pr-12 ${className ?? ""}`} {...props} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
          aria-pressed={visible}
          className="absolute right-0 top-0 flex h-12 min-h-[44px] w-12 min-w-[44px] items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          {visible ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
