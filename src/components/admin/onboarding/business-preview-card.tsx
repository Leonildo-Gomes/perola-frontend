"use client";

import { Calendar, CheckCircle2, MapPin, MessageCircle, RefreshCw, Sparkles, Star } from "lucide-react";

interface PreviewCategory {
  name: string;
  isPrimary: boolean;
}

interface BusinessPreviewCardProps {
  name: string;
  island: string;
  city: string;
  location: string;
  phone: string;
  logoUrl?: string | null;
  categories?: PreviewCategory[];
}

export function BusinessPreviewCard({
  name,
  island,
  city,
  location,
  phone,
  logoUrl,
  categories = [],
}: BusinessPreviewCardProps) {
  const orderedCategories = [...categories].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary),
  );
  const displayName = name.trim() || "Salão Pérola VIP";
  const displayLocation = location.trim() || "Rua Pedonal do Plateau";
  const displayCity = city.trim() || "Praia";
  const displayIsland = island.trim() || "Santiago";

  // Formatted phone display
  const formattedPhone = phone
    ? [phone.slice(0, 3), phone.slice(3, 5), phone.slice(5, 7)].filter(Boolean).join(" ")
    : "991 23 45";

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 lg:sticky lg:top-24 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-perola-deep" aria-hidden />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Pré-visualização em Tempo Real
          </span>
        </div>
        <span className="rounded-full bg-perola-mint px-2 py-0.5 text-[10px] font-extrabold uppercase text-perola-deep">
          Ao Vivo
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Como o seu salão aparecerá aos clientes no Marketplace Pérola.
      </p>

      {/* Floating Card Mockup */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all hover:shadow-lg">
        {/* Cover Image with Overlays */}
        <div className="relative h-44 w-full bg-gradient-to-br from-teal-800 to-slate-900">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(#0D9488_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-perola-mint/95 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-perola-deep shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5 fill-perola-deep text-white" aria-hidden />
            <span>Verificado Pérola</span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" aria-hidden />
            <span>4.9</span>
            <span className="text-[10px] font-normal text-slate-400">(Novo)</span>
          </div>

          {/* Bottom Badge: Aberto Hoje */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-emerald-500/90 text-white text-[11px] font-semibold px-2 py-0.5 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span>Aberto Hoje</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3.5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 leading-tight">
              {displayName}
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <MapPin className="h-3.5 w-3.5 text-perola-deep shrink-0" aria-hidden />
              <span className="truncate">
                {displayLocation}, {displayCity} (Ilha de {displayIsland})
              </span>
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-1.5">
            {orderedCategories.length > 0 ? (
              orderedCategories.map((cat) => (
                <span
                  key={cat.name}
                  className={
                    cat.isPrimary
                      ? "inline-flex items-center gap-1 rounded-lg border border-perola-deep/30 bg-perola-mint/70 px-2.5 py-1 text-[11px] font-bold text-perola-deep"
                      : "rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                  }
                >
                  {cat.isPrimary && (
                    <Star
                      className="h-3 w-3 fill-perola-deep text-perola-deep"
                      aria-hidden
                    />
                  )}
                  {cat.name}
                </span>
              ))
            ) : (
              <span className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] italic text-slate-400">
                Nenhuma categoria selecionada
              </span>
            )}
          </div>

          {/* Official WhatsApp Contact Widget */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
                <MessageCircle className="h-4 w-4" aria-hidden />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  WhatsApp Oficial
                </span>
                <span className="font-accent text-xs font-bold text-slate-800">
                  +238 {formattedPhone}
                </span>
              </div>
            </div>
            <span className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-perola-deep shadow-2xs">
              Contacto
            </span>
          </div>

          {/* Disabled Preview CTA */}
          <div className="w-full flex items-center justify-center gap-2 rounded-xl border border-perola-deep/20 bg-perola-mint/40 py-2.5 text-xs font-bold text-perola-deep">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            <span>Agendar Online</span>
            <span className="text-[10px] font-normal opacity-70 uppercase">(Modo Pré-visualização)</span>
          </div>
        </div>
      </div>

      {/* Sync status */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <RefreshCw className="h-3.5 w-3.5 text-perola-deep" aria-hidden />
        <span>Sincronização instantânea ativa • 0% taxa de adesão</span>
      </div>
    </div>
  );
}

