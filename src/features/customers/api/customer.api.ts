import { api } from "@/lib/api/client";
import type { Page } from "@/types/api.types";
import type {
  AppointmentReview,
  CancelAppointmentPayload,
  CreateReviewPayload,
  CustomerAppointment,
  CustomerAppointmentsFilter,
  RescheduleAppointmentPayload,
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

