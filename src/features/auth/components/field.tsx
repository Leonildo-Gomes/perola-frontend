import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  /** Right-aligned content on the label row (e.g. password strength tag). */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Label + control + inline error (wired through `${id}-error` for aria-describedby). */
export function Field({ id, label, error, aside, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-slate-900">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
