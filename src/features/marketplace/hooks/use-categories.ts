"use client";

import { useQuery } from "@tanstack/react-query";
import { marketplaceQueries } from "../queries/marketplace.queries";

/**
 * Fetches global active beauty & wellness categories (`GET /api/v1/marketplace/categories`)
 * with a 1-hour staleTime.
 */
export function useCategories(enabled: boolean = true) {
  return useQuery(marketplaceQueries.categories(enabled));
}

