import { queryOptions } from "@tanstack/react-query";
import { bookingKeys } from "./booking.keys";
import {
  loadBookingTarget,
  getAppointment,
  getBusinessProfile,
} from "../api/booking.api";

export const bookingQueries = {
  target: (serviceId: string, businessIdHint?: string | null) =>
    queryOptions({
      queryKey: bookingKeys.target(serviceId, businessIdHint),
      queryFn: ({ signal }) =>
        loadBookingTarget(serviceId, businessIdHint, signal),
      staleTime: 60_000,
    }),

  appointment: (appointmentId: string, enabled: boolean = true) =>
    queryOptions({
      queryKey: bookingKeys.appointment(appointmentId),
      queryFn: ({ signal }) => getAppointment(appointmentId, signal),
      enabled: Boolean(appointmentId) && enabled,
      staleTime: 60_000,
    }),

  businessProfile: (businessId: string, enabled: boolean = true) =>
    queryOptions({
      queryKey: bookingKeys.businessProfile(businessId),
      queryFn: ({ signal }) => getBusinessProfile(businessId, signal),
      enabled: Boolean(businessId) && enabled,
      staleTime: 60_000,
    }),
};

