"use client";

import { useQuery } from "@tanstack/react-query";
import { customerQueries } from "../queries/customer.queries";
import type { CustomerAppointmentsFilter } from "../types/customer.types";

export function useMyBookings(
  filter?: CustomerAppointmentsFilter,
  enabled: boolean = true,
) {
  return useQuery(customerQueries.myBookings(filter, enabled));
}

