import { queryOptions } from "@tanstack/react-query";
import { scheduleKeys } from "./schedule.keys";
import {
  getSalonAppointments,
  getMyAppointments,
} from "../api/schedule.api";
import type {
  SalonAppointmentsFilter,
  CustomerAppointmentsFilter,
} from "../types/schedule.types";

export const scheduleQueries = {
  salonAppointments: (businessId: string, filter?: SalonAppointmentsFilter) =>
    queryOptions({
      queryKey: scheduleKeys.salonList(businessId, filter),
      queryFn: ({ signal }) => getSalonAppointments(filter, signal),
      enabled: Boolean(businessId),
      staleTime: 10_000,
      gcTime: 5 * 60 * 1000,
      refetchInterval: 30_000,
      refetchOnWindowFocus: false,
    }),

  customerAppointments: (filter?: CustomerAppointmentsFilter) =>
    queryOptions({
      queryKey: scheduleKeys.customerList(filter),
      queryFn: ({ signal }) => getMyAppointments(filter, signal),
      staleTime: 30_000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }),
};

