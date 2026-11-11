"use client";

import { useQuery } from "@tanstack/react-query";
import { marketplaceQueries } from "../queries/marketplace.queries";
import type { MarketplaceFilters } from "../types/marketplace.types";

export function useMarketplaceBusinesses(
  filters: MarketplaceFilters,
  enabled: boolean = true,
) {
  return useQuery(marketplaceQueries.businesses(filters, enabled));
}
