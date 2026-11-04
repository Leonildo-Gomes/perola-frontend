import { Clock, Flower2, MapPin, Star, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { MarketplaceService } from "@/types/marketplace";

interface ServiceCardProps {
  service: MarketplaceService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const place = [service.businessCity, service.businessIsland].filter(Boolean).join(", ") || null;
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[2/1] overflow-hidden sm:aspect-[4/3] rounded-xl bg-gradient-to-br from-perola-mint via-teal-50 to-slate-100">
        {service.imageUrl ? (
          <Image src={service.imageUrl} alt={service.name} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-perola-deep/40" aria-hidden>
            <Flower2 className="h-14 w-14" />
          </span>
        )}
        {service.rating != null && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 font-accent text-xs font-bold text-slate-900 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-perola-gold text-perola-gold" aria-hidden />
            {service.rating.toFixed(1)}
            {service.reviewCount != null && <span className="font-normal text-slate-500">({service.reviewCount})</span>}
          </span>
        )}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-slate-900/70 px-2.5 py-1 font-accent text-xs font-semibold text-white backdrop-blur">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {formatDuration(service.durationMinutes)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1 pb-1 pt-3">
        <div className="flex items-start justify-between gap-2 text-xs">
          <span className="truncate font-semibold text-perola-deep">{service.businessName ?? "Salão parceiro"}</span>
          {place && (
            <span className="flex shrink-0 items-center gap-1 text-slate-500">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              <span className="max-w-[9rem] truncate">{place}</span>
            </span>
          )}
        </div>
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900">{service.name}</h3>
        {service.description && <p className="line-clamp-2 text-sm text-slate-500">{service.description}</p>}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">Preço total</span>
            <span className="font-accent text-xl font-extrabold text-slate-900">{formatCurrency(service.price)}</span>
          </div>
          <Button asChild variant="brand" className="rounded-full px-6">
            <Link href={`/book/${service.id}`} aria-label={`Agendar ${service.name}`}>
              Agendar
              <CalendarDays className="h-4 w-4 ml-2" aria-hidden />
            </Link>

          </Button>
        </div>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3" aria-hidden>
      <div className="aspect-[2/1] rounded-xl bg-slate-100 sm:aspect-[4/3]" />
      <div className="h-3 w-1/2 rounded bg-slate-100" />
      <div className="h-5 w-3/4 rounded bg-slate-100" />
      <div className="h-3 w-full rounded bg-slate-100" />
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="h-6 w-24 rounded bg-slate-100" />
        <div className="h-11 w-28 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}
