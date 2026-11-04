import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

/** Label + control + inline error (wired through `${id}-error` for aria-describedby). */
export function Field({ id, label, error, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
