import type {
  BusinessCustomersFilter,
  CustomerAppointmentsFilter,
} from "../types/customer.types";

export const customerKeys = {
  all: ["customers"] as const,

  myBookings: (filter?: CustomerAppointmentsFilter) =>
    ["my-bookings", filter] as const,

  businessCustomers: (businessId: string, filter?: BusinessCustomersFilter) =>
    ["business-customers", businessId, filter] as const,

  businessCustomerDetail: (businessId: string, customerId: string) =>
    ["business-customer-detail", businessId, customerId] as const,
};

