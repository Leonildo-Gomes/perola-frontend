import { passwordStrength } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

const LABELS = ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte"];
const COLORS = ["bg-rose-500", "bg-rose-500", "bg-amber-500", "bg-teal-500", "bg-emerald-600"];

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = passwordStrength(password);
  return (
    <div className="flex flex-col gap-1" aria-live="polite">
      <div className="flex gap-1" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("h-1.5 flex-1 rounded-full", i <= score ? COLORS[score] : "bg-slate-200")} />
        ))}
      </div>
      <span className="text-xs text-slate-600">Segurança: {LABELS[score]}</span>
    </div>
  );
}
