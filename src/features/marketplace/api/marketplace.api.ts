import { api } from "@/lib/api/client";
import type { Page } from "@/types/api.types";
import type {
  MarketplaceBusiness,
  MarketplaceCategory,
  MarketplaceFilters,
  MarketplaceService,
} from "../types/marketplace.types";

export const SERVICES_PAGE_SIZE = 12;

// Public endpoints: no auth, never tenant-scoped.
const PUBLIC = { skipAuth: true, tenant: false } as const;

/**
 * List active beauty & wellness categories ordered by `displayOrder` (`GET /api/v1/marketplace/categories`).
 */
export async function getMarketplaceCategories(
  signal?: AbortSignal,
): Promise<MarketplaceCategory[]> {
  const res = await api.get<
    MarketplaceCategory[] | Page<MarketplaceCategory>
  >("/api/v1/marketplace/categories", {
    ...PUBLIC,
    signal,
  });

  const list = Array.isArray(res) ? res : res?.content ?? [];
  return [...list].sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Search and filter active marketplace services (`GET /api/v1/marketplace/services`).
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

/**
 * Search and filter active marketplace businesses (`GET /api/v1/marketplace/businesses`).
 */
export const searchBusinesses = (
  filters: MarketplaceFilters,
  signal?: AbortSignal,
) =>
  api.get<Page<MarketplaceBusiness>>("/api/v1/marketplace/businesses", {
    ...PUBLIC,
    signal,
    query: {
      query: filters.query,
      category: filters.category,
      island: filters.island,
      city: filters.city,
      page: 0,
      size: 100,
    },
  });
