"use client";

import { useQuery } from "@tanstack/react-query";
import { serviceQueries } from "../queries/service.queries";

export function useServices(businessId: string) {
    return useQuery(serviceQueries.list(businessId));
}

export function useService(businessId: string, serviceId: string) {
    return useQuery(serviceQueries.detail(businessId, serviceId));
}

export function useActiveServices(businessId: string) {
    return useQuery(serviceQueries.active(businessId));
}