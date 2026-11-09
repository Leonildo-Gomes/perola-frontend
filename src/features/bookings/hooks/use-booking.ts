"use client";

import { useQuery } from "@tanstack/react-query";
import { bookingQueries } from "../queries/booking.queries";

export function useBookingTarget(
  serviceId: string,
  businessIdHint?: string | null,
) {
  return useQuery(bookingQueries.target(serviceId, businessIdHint));
}

export function useBookingAppointment(
  appointmentId: string,
  enabled: boolean = true,
) {
  return useQuery(bookingQueries.appointment(appointmentId, enabled));
}

export function usePublicBusinessProfile(
  businessId: string,
  enabled: boolean = true,
) {
  return useQuery(bookingQueries.businessProfile(businessId, enabled));
}

