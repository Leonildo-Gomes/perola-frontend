"use client";

import { useQuery } from "@tanstack/react-query";
import { scheduleQueries } from "../queries/schedule.queries";
import type {
  CustomerAppointmentsFilter,
  SalonAppointmentsFilter,
} from "../types/schedule.types";

export function useSalonAppointments(
  businessId: string,
  filter?: SalonAppointmentsFilter,
) {
  return useQuery(scheduleQueries.salonAppointments(businessId, filter));
}

export function useCustomerAppointments(filter?: CustomerAppointmentsFilter) {
  return useQuery(scheduleQueries.customerAppointments(filter));
}

