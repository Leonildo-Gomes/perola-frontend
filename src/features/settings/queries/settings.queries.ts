import { queryOptions } from "@tanstack/react-query";
import { settingsKeys } from "./settings.keys";
import { getBusiness } from "../api/settings.api";

export const settingsQueries = {
  business: (businessId: string) =>
    queryOptions({
      queryKey: settingsKeys.businessDetail(businessId),
      queryFn: ({ signal }) => getBusiness(businessId, signal),
      enabled: Boolean(businessId),
      staleTime: 60_000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }),
};

