import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Action area (buttons). */
  children?: React.ReactNode;
  tone?: "neutral" | "error";
  className?: string;
}

/** Shared empty / error block (actionable feedback with CTA). */
export function EmptyState({ icon: Icon, title, description, children, tone = "neutral", className }: EmptyStateProps) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn("flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center", className)}
    >
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full",
          tone === "error" ? "bg-rose-50 text-rose-600" : "bg-perola-mint text-perola-deep",
        )}
      >
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
      {children && <div className="mt-2 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}
