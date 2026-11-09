"use client";

import { AlertTriangle, ArrowRight, Loader2, SearchX } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { EmptyState } from "@/components/shared/feedback";
import { Button } from "@/components/ui/button";
import { useLocationHydrated } from "@/hooks/use-location-hydrated";
import { useMarketplaceInfiniteServices } from "../hooks/use-marketplace-services";
import { SERVICE_CATEGORIES } from "@/lib/categories";
import { useLocationStore } from "@/stores/location-store";
import type { MarketplaceFilters } from "../types/marketplace.types";
import { LocationFilter } from "./location-filter";
import { ServiceCard, ServiceCardSkeleton } from "./service-card";

interface ServiceFeedProps {
  /** `home`: banner + first page of highlights. `explore`: filters sidebar + infinite scroll. */
  variant?: "home" | "explore";
}

export function ServiceFeed({ variant = "explore" }: ServiceFeedProps) {
  const router = useRouter();
  const params = useSearchParams();
  const hydrated = useLocationHydrated();
  const island = useLocationStore((s) => s.island);
  const city = useLocationStore((s) => s.city);
  const setLocation = useLocationStore((s) => s.setLocation);

  const query = params.get("q") ?? "";
  const category = params.get("category");
  const filters = useMemo<MarketplaceFilters>(
    () => ({ query: query || undefined, category, island, city }),
    [query, category, island, city],
  );
  const locationActive = Boolean(island || city);
  const placeLabel = city ?? island ?? "Cabo Verde";

  const services = useMarketplaceInfiniteServices(filters, hydrated);

  const items = useMemo(() => {
    // The API only lists active services (no `isActive` in the payload) and filters island/city itself.
    const all = services.data?.pages.flatMap((p) => p.content).filter((s) => s.isActive !== false) ?? [];
    return variant === "home" ? all.slice(0, 6) : all;
  }, [services.data, variant]);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = services;
  // React 19: ref callbacks may return a cleanup function.
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || variant === "home") return;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) void fetchNextPage();
        },
        { rootMargin: "400px" },
      );
      io.observe(node);
      return () => io.disconnect();
    },
    [variant, hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const clearFilters = () => {
    setLocation(null, null);
    router.push("/explore");
  };

  const isLoading = !hydrated || services.isPending;
  const categoryLabel = SERVICE_CATEGORIES.find((c) => c.slug === category)?.label;
  const total = services.data?.pages[0]?.totalElements;
  const heading =
    variant === "home" ? (
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Serviços em Destaque</h2>
          <p className="text-sm text-slate-500">Mais procurados em {placeLabel}</p>
        </div>
        <Link href="/explore" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-perola-deep hover:underline">
          Ver todos <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    ) : (
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {query ? `Resultados para “${query}”` : categoryLabel ? `${categoryLabel} em ${placeLabel}` : `Serviços em Destaque em ${placeLabel}`}
        </h1>
        {!locationActive && total != null && (
          <p className="text-sm text-slate-500" aria-live="polite">
            {total} {total === 1 ? "serviço encontrado" : "serviços encontrados"}
          </p>
        )}
      </div>
    );

  let body: React.ReactNode;
  if (isLoading) {
    body = (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="A carregar serviços">
        {Array.from({ length: 6 }, (_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  } else if (services.isError) {
    body = (
      <EmptyState
        tone="error"
        icon={AlertTriangle}
        title="Não foi possível carregar os serviços"
        description="Verifique a sua ligação à internet e tente novamente."
      >
        <Button variant="brand" onClick={() => void services.refetch()}>
          Tentar Novamente
        </Button>
      </EmptyState>
    );
  } else if (items.length === 0 && !hasNextPage) {
    body = (
      <EmptyState
        icon={SearchX}
        title={`Nenhum serviço encontrado em ${placeLabel}`}
        description="Experimente outra categoria ou veja os serviços de todas as ilhas."
      >
        <Button variant="brand" onClick={clearFilters}>
          Limpar filtros
        </Button>
      </EmptyState>
    );
  } else {
    body = (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
        {variant === "explore" && (
          <div className="flex min-h-[64px] items-center justify-center py-6">
            {isFetchingNextPage ? (
              <span className="inline-flex items-center gap-2 text-sm text-slate-500" role="status">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                A carregar mais serviços...
              </span>
            ) : services.isFetchNextPageError ? (
              <Button variant="outline" onClick={() => void fetchNextPage()}>
                Tentar Novamente
              </Button>
            ) : hasNextPage ? (
              <Button variant="outline" onClick={() => void fetchNextPage()}>
                Carregar mais
              </Button>
            ) : (
              <span className="text-sm text-slate-500">Chegou ao fim dos resultados.</span>
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      {variant === "home" && (
        <section className="mb-8 rounded-2xl border border-teal-100 bg-gradient-to-br from-perola-mint/60 to-white p-5">
          <p className="flex items-center gap-2 font-accent text-xs font-bold uppercase tracking-wider text-perola-deep">
            <span aria-hidden className="h-2 w-2 rounded-full bg-perola-deep" />
            Autocuidado em {placeLabel}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Bem-vindo à Pérola</h1>
          <p className="mt-1 max-w-xl text-slate-600">
            Reserve os melhores salões e especialistas de beleza de {placeLabel} com confirmação imediata.
          </p>
        </section>
      )}

      <div className={variant === "explore" ? "lg:grid lg:grid-cols-[260px_1fr] lg:gap-8" : undefined}>
        {variant === "explore" && (
          <aside className="mb-6 hidden self-start rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24 lg:block">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Filtros</h2>
              <button type="button" onClick={clearFilters} className="min-h-[44px] text-sm font-semibold text-perola-deep hover:underline">
                Limpar
              </button>
            </div>
            <p className="mb-2 mt-4 font-accent text-xs font-bold uppercase tracking-wider text-slate-500">Ilha & Concelho</p>
            <LocationFilter />
          </aside>
        )}
        <div className="flex min-w-0 flex-col gap-5">
          {heading}
          {body}
          {variant === "explore" && !isLoading && !services.isError && <div ref={sentinelRef} aria-hidden className="h-px" />}
        </div>
      </div>
    </div>
  );
}
