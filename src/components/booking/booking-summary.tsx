import { CalendarDays, Clock, MapPin, Store, UserRound, Wallet } from "lucide-react";
import { formatInstantLong, formatTime } from "@/lib/datetime";
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { PublicBusinessProfile } from "@/types/booking";
import type { MarketplaceService } from "@/types/marketplace";

interface BookingSummaryProps {
  business: PublicBusinessProfile;
  service: MarketplaceService;
  employeeLabel: string;
  startTime: string | null;
  className?: string;
}

function Row({ icon: Icon, label, children }: { icon: typeof Store; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-perola-mint text-perola-deep">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-slate-500">{label}</dt>
        <dd className="text-sm font-semibold text-slate-900">{children}</dd>
      </div>
    </div>
  );
}

export function BookingSummary({ business, service, employeeLabel, startTime, className }: BookingSummaryProps) {
  return (
    <section aria-label="Resumo da marcação" className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className ?? ""}`}>
      <h2 className="text-lg font-bold text-slate-900">{service.name}</h2>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
        <Clock className="h-3.5 w-3.5" aria-hidden />
        {formatDuration(service.durationMinutes)}
      </p>

      <dl className="mt-4 space-y-3.5">
        <Row icon={Store} label="Salão">{business.name}</Row>
        <Row icon={MapPin} label="Endereço">
          {[business.location, business.city, business.island].filter(Boolean).join(", ")}
        </Row>
        <Row icon={UserRound} label="Profissional">{employeeLabel}</Row>
        <Row icon={CalendarDays} label="Data e hora">
          {startTime ? (
            <span>
              {formatInstantLong(startTime)} às {formatTime(startTime)}
            </span>
          ) : (
            <span className="font-normal text-slate-400">Por escolher</span>
          )}
        </Row>
      </dl>

      <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <Wallet className="h-3.5 w-3.5" aria-hidden />
            A pagar no local
          </p>
        </div>
        <p className="font-accent text-2xl font-extrabold text-slate-900">{formatCurrency(service.price)}</p>
      </div>
    </section>
  );
}
