import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { passwordStrength } from "@/lib/validations/auth";

export const STRENGTH_LABELS = ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte"];

/** 4-segment meter + hint line (Stitch register screen). */
export function PasswordStrength({ password }: { password: string }) {
  const score = password ? passwordStrength(password) : 0;
  const ok = password.length >= 8;
  return (
    <div className="flex flex-col gap-1.5" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn("h-1 flex-1 rounded-full", i <= score ? (score >= 3 ? "bg-teal-500" : "bg-amber-500") : "bg-slate-200")}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Mínimo de 8 caracteres</span>
        {ok && (
          <span className="inline-flex items-center gap-1 font-semibold text-teal-600">
            <Check className="h-3.5 w-3.5" aria-hidden />
            Tudo certo
          </span>
        )}
      </div>
    </div>
  );
}
