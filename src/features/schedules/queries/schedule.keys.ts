import type {
  CustomerAppointmentsFilter,
  SalonAppointmentsFilter,
} from "../types/schedule.types";

export const scheduleKeys = {
  all: ["schedules"] as const,

  salon: () => [...scheduleKeys.all, "salon"] as const,

  salonList: (businessId: string, filter?: SalonAppointmentsFilter) =>
    [...scheduleKeys.salon(), businessId, filter] as const,

  customer: () => [...scheduleKeys.all, "customer"] as const,

  customerList: (filter?: CustomerAppointmentsFilter) =>
    [...scheduleKeys.customer(), filter] as const,

  detail: (appointmentId: string) =>
    [...scheduleKeys.all, "detail", appointmentId] as const,
};

