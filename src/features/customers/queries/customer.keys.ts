import type { CustomerAppointmentsFilter } from "../types/customer.types";

export const customerKeys = {
  all: ["customers"] as const,

  myBookings: (filter?: CustomerAppointmentsFilter) =>
    ["my-bookings", filter] as const,
};

