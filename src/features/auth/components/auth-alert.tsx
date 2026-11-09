import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/utils";

export function AuthAlert({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden />
      <div>{children}</div>
    </div>
  );
}
