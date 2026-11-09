import { queryOptions } from "@tanstack/react-query";
import { customerKeys } from "./customer.keys";
import { getMyAppointments } from "../api/customer.api";
import type { CustomerAppointmentsFilter } from "../types/customer.types";

export const customerQueries = {
  myBookings: (filter?: CustomerAppointmentsFilter, enabled: boolean = true) =>
    queryOptions({
      queryKey: customerKeys.myBookings(filter),
      queryFn: ({ signal }) => getMyAppointments(filter, signal),
      enabled,
      staleTime: 30_000,
    }),
};

