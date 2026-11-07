import { queryOptions } from "@tanstack/react-query";
import { serviceKeys } from "./service.keys";

import { getServices, getService } from "../api/service.api";
export const serviceQueries = {
    list: (businessId: string) => queryOptions({
        queryKey: serviceKeys.list(businessId),
        queryFn: ({ signal }) => getServices(businessId, signal),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: Boolean(businessId),
        refetchOnWindowFocus: false,
    }),
    detail: (businessId: string, serviceId: string) => queryOptions({
        queryKey: serviceKeys.detail(businessId, serviceId),
        queryFn: ({ signal }) => getService(businessId, serviceId, signal),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: Boolean(businessId),
        refetchOnWindowFocus: false,
    }),

}