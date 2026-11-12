import { Logo, PerolaMark } from "@/components/shared/branding";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Brand header (pearl emblem on mobile, logo on desktop) + title + content + footer. */
export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="flex flex-col">
      <div className="mb-6 text-center lg:mb-8 lg:text-left">
        <div className="mb-4 hidden lg:block">
          <Logo tagline="Beauty & Wellness Platform" />
        </div>
        <div className="mx-auto mb-4 flex justify-center lg:hidden">
          <PerolaMark size="lg" variant="solid" className="shadow-lg shadow-perola-deep/15" />
        </div>
        <h1 className="text-[26px] font-bold leading-[34px] tracking-tight text-slate-900 lg:text-[32px] lg:leading-10">{title}</h1>
        {description && <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 lg:mx-0 lg:max-w-none lg:text-base">{description}</p>}
      </div>
      {children}
      {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
    </div>
  );
}
