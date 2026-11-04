import { Logo } from "@/components/common/logo";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({ title, description, children, footer, className }: AuthCardProps) {
  return (
    <div className={cn("w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8", className)}>
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <Logo />
        <h1 className="text-h3 text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-600">{description}</p>}
      </div>
      {children}
      {footer && <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-600">{footer}</div>}
    </div>
  );
}
