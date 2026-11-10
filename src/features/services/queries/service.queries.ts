import { queryOptions } from "@tanstack/react-query";
import { serviceKeys } from "./service.keys";
import { getServices, getService, getActiveServices } from "../api/service.api";


const DEFAULT_QUERY_OPTIONS = {
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
} as const;


export const serviceQueries = {
    list: (businessId: string) => queryOptions({
        ...DEFAULT_QUERY_OPTIONS,
        queryKey: serviceKeys.list(businessId),
        queryFn: ({ signal }) => getServices(businessId, signal),
        enabled: Boolean(businessId),
    }),
    detail: (businessId: string, serviceId: string) => queryOptions({
        ...DEFAULT_QUERY_OPTIONS,
        queryKey: serviceKeys.detail(businessId, serviceId),
        queryFn: ({ signal }) => getService(businessId, serviceId, signal),
        enabled: Boolean(businessId) && Boolean(serviceId),
    }),
    active: (businessId: string) => queryOptions({
        ...DEFAULT_QUERY_OPTIONS,
        queryKey: serviceKeys.active(businessId),
        queryFn: ({ signal }) => getActiveServices(businessId, signal),
        enabled: Boolean(businessId),
    }),
};