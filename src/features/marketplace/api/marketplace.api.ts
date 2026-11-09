import { api } from "@/lib/api/client";
import type { Page } from "@/types/api";
import type {
  MarketplaceBusiness,
  MarketplaceFilters,
  MarketplaceService,
} from "../types/marketplace.types";

export const SERVICES_PAGE_SIZE = 12;

// Public endpoints: no auth, never tenant-scoped.
const PUBLIC = { skipAuth: true, tenant: false } as const;

/**
 * The real backend filters by `query`, `island` and `city` (verified). `category` is sent too but
 * is currently ignored. Each service carries `businessName/businessIsland/businessCity`.
 */
export const searchServices = (
  filters: MarketplaceFilters,
  page: number,
  signal?: AbortSignal,
) =>
  api.get<Page<MarketplaceService>>("/api/v1/marketplace/services", {
    ...PUBLIC,
    signal,
    query: {
      query: filters.query,
      category: filters.category,
      island: filters.island,
      city: filters.city,
      page,
      size: SERVICES_PAGE_SIZE,
    },
  });

export const searchBusinesses = (
  filters: Pick<MarketplaceFilters, "query" | "island" | "city">,
  signal?: AbortSignal,
) =>
  api.get<Page<MarketplaceBusiness>>("/api/v1/marketplace/businesses", {
    ...PUBLIC,
    signal,
    query: {
      query: filters.query,
      island: filters.island,
      city: filters.city,
      page: 0,
      size: 100,
    },
  });

