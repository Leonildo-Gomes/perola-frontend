import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { marketplaceKeys } from "./marketplace.keys";
import { searchBusinesses, searchServices } from "../api/marketplace.api";
import type { MarketplaceFilters } from "../types/marketplace.types";

export const marketplaceQueries = {
  infiniteServices: (filters: MarketplaceFilters, enabled: boolean = true) =>
    infiniteQueryOptions({
      queryKey: marketplaceKeys.services(filters),
      queryFn: ({ pageParam, signal }) =>
        searchServices(filters, pageParam, signal),
      initialPageParam: 0,
      getNextPageParam: (last) =>
        last.page + 1 < last.totalPages ? last.page + 1 : undefined,
      enabled,
      staleTime: 60_000,
    }),

  businesses: (
    filters: Pick<MarketplaceFilters, "query" | "island" | "city">,
    enabled: boolean = true,
  ) =>
    queryOptions({
      queryKey: marketplaceKeys.businesses(filters),
      queryFn: ({ signal }) => searchBusinesses(filters, signal),
      enabled,
      staleTime: 60_000,
    }),
};

