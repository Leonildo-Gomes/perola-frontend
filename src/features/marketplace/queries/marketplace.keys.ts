import type { MarketplaceFilters } from "../types/marketplace.types";

export const marketplaceKeys = {
  all: ["marketplace"] as const,

  categories: () => [...marketplaceKeys.all, "categories"] as const,

  services: (filters: MarketplaceFilters) =>
    [...marketplaceKeys.all, "services", filters] as const,

  businesses: (filters: MarketplaceFilters) =>
    [...marketplaceKeys.all, "businesses", filters] as const,
};
