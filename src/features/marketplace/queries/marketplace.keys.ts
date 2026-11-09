import type { MarketplaceFilters } from "../types/marketplace.types";

export const marketplaceKeys = {
  all: ["marketplace"] as const,

  services: (filters: MarketplaceFilters) =>
    [...marketplaceKeys.all, "services", filters] as const,

  businesses: (filters: Pick<MarketplaceFilters, "query" | "island" | "city">) =>
    [...marketplaceKeys.all, "businesses", filters] as const,
};

