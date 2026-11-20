import { api } from "@/lib/api/client";
import type { Page } from "@/types/api.types";
import type {
  AppointmentReview,
  BusinessCustomer,
  BusinessCustomerDetail,
  BusinessCustomersFilter,
  CancelAppointmentPayload,
  CreateReviewPayload,
  CustomerAppointment,
  CustomerAppointmentsFilter,
  RescheduleAppointmentPayload,
  UpdateBusinessCustomerPayload,
} from "../types/customer.types";

/**
 * Fetch the authenticated customer's appointments (`GET /api/v1/appointments/my`).
 */
export async function getMyAppointments(
  filter?: CustomerAppointmentsFilter,
  signal?: AbortSignal,
): Promise<CustomerAppointment[]> {
  const query: Record<string, string | number> = {};
  if (filter?.status) query.status = filter.status;
  if (typeof filter?.page === "number") query.page = filter.page;
  if (typeof filter?.size === "number") query.size = filter.size;

  const res = await api.get<Page<CustomerAppointment> | CustomerAppointment[]>(
    "/api/v1/appointments/my",
    {
      tenant: false,
      signal,
      query: Object.keys(query).length > 0 ? query : undefined,
    },
  );

  const rawList = Array.isArray(res) ? res : res?.content ?? [];

  return rawList.map((item) => ({
    ...item,
    businessName: item.businessName,
    businessCity: item.businessCity,
    businessIsland: item.businessIsland,
    businessAddress: item.businessAddress,
    employeeName: item.employeeName,
  }));
}

/**
 * Propose a new date/time for an existing appointment (`PATCH /api/v1/appointments/{id}/reschedule`).
 */
export async function requestReschedule(
  appointmentId: string,
  payload: RescheduleAppointmentPayload,
): Promise<CustomerAppointment> {
  return api.patch<CustomerAppointment>(
    `/api/v1/appointments/${appointmentId}/reschedule`,
    payload,
    { tenant: false },
  );
}

/**
 * Cancel an appointment with an optional reason (`POST /api/v1/appointments/{id}/cancel`).
 */
export async function cancelAppointment(
  appointmentId: string,
  payload?: CancelAppointmentPayload,
): Promise<CustomerAppointment> {
  return api.post<CustomerAppointment>(
    `/api/v1/appointments/${appointmentId}/cancel`,
    payload ?? {},
    { tenant: false },
  );
}

/**
 * Submit a customer review after an appointment is completed (`POST /api/v1/appointments/{id}/reviews`).
 */
export async function submitReview(
  appointmentId: string,
  payload: CreateReviewPayload,
): Promise<AppointmentReview> {
  return api.post<AppointmentReview>(
    `/api/v1/appointments/${appointmentId}/reviews`,
    payload,
    { tenant: false },
  );
}

/**
 * Fetch the salon's CRM customers paginated (`GET /api/v1/businesses/{businessId}/customers`).
 */
export async function getBusinessCustomers(
  businessId: string,
  filter?: BusinessCustomersFilter,
  signal?: AbortSignal,
): Promise<Page<BusinessCustomer>> {
  const query: Record<string, string | number> = {};
  if (filter?.search) query.search = filter.search;
  if (filter?.tier) query.tier = filter.tier;
  if (typeof filter?.page === "number") query.page = filter.page;
  if (typeof filter?.size === "number") query.size = filter.size;

  const res = await api.get<any>(
    `/api/v1/businesses/${businessId}/customers`,
    {
      tenant: true,
      signal,
      query: Object.keys(query).length > 0 ? query : undefined,
    },
  );

  const raw = res?.data ?? res;
  if (Array.isArray(raw)) {
    return {
      content: raw,
      page: filter?.page ?? 0,
      size: filter?.size ?? raw.length,
      totalElements: raw.length,
      totalPages: 1,
      last: true,
    };
  }

  return raw as Page<BusinessCustomer>;
}

/**
 * Fetch a single salon customer's profile & appointment history (`GET /api/v1/businesses/{businessId}/customers/{customerId}`).
 */
export async function getBusinessCustomerDetail(
  businessId: string,
  customerId: string,
  signal?: AbortSignal,
): Promise<BusinessCustomerDetail> {
  const res = await api.get<any>(
    `/api/v1/businesses/${businessId}/customers/${customerId}`,
    {
      tenant: true,
      signal,
    },
  );

  const raw = res?.data ?? res?.customer ?? res?.result ?? res;
  return raw as BusinessCustomerDetail;
}

/**
 * Update a customer's classification tier and/or private notes (`PATCH /api/v1/businesses/{businessId}/customers/{customerId}`).
 */
export async function updateBusinessCustomer(
  businessId: string,
  customerId: string,
  payload: UpdateBusinessCustomerPayload,
): Promise<BusinessCustomer> {
  return api.patch<BusinessCustomer>(
    `/api/v1/businesses/${businessId}/customers/${customerId}`,
    payload,
    {
      tenant: true,
    },
  );
}

