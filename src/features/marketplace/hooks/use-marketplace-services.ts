"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { marketplaceQueries } from "../queries/marketplace.queries";
import type { MarketplaceFilters } from "../types/marketplace.types";

export function useMarketplaceInfiniteServices(
  filters: MarketplaceFilters,
  enabled: boolean = true,
) {
  return useInfiniteQuery(marketplaceQueries.infiniteServices(filters, enabled));
}

