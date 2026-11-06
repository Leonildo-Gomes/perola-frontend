import type { Page } from "@/types/api";
import type {
  AppointmentReview,
  CancelAppointmentPayload,
  CreateReviewPayload,
  CustomerAppointment,
  CustomerAppointmentsFilter,
  RescheduleAppointmentPayload,
  SalonAppointment,
  SalonAppointmentsFilter,
} from "@/types/appointments";
import { api } from "./client";

/**
 * Fetch the authenticated customer's appointments (`GET /api/v1/appointments/my`).
 * Supports both paginated Page<CustomerAppointment> and direct array responses.
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

  // Normalize and return customer appointments
  return rawList.map((item) => ({
    ...item,
    businessName: item.businessName ?? "Salão Parceiro",
    businessCity: item.businessCity ?? "Praia",
    businessIsland: item.businessIsland ?? "Santiago",
    businessAddress: item.businessAddress ?? "Cabo Verde",
    employeeName: item.employeeName ?? "Profissional",
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

/* ========================================================================= */
/* SALON MANAGEMENT ADMIN APPOINTMENTS                                       */
/* ========================================================================= */

/**
 * Fetch salon appointments for operational schedule (`GET /api/v1/appointments`).
 * Uses `X-Business-Id` via `tenant: true`.
 */
export async function getSalonAppointments(
  filter?: SalonAppointmentsFilter,
  signal?: AbortSignal,
): Promise<SalonAppointment[]> {
  const query: Record<string, string | number> = {};
  if (filter?.date) query.date = filter.date;
  if (filter?.employeeId) query.employeeId = filter.employeeId;
  if (filter?.status) query.status = filter.status;
  if (typeof filter?.page === "number") query.page = filter.page;
  if (typeof filter?.size === "number") query.size = filter.size;

  const res = await api.get<Page<SalonAppointment> | SalonAppointment[]>(
    "/api/v1/appointments",
    {
      tenant: true,
      signal,
      query: Object.keys(query).length > 0 ? query : undefined,
    },
  );

  const rawList = Array.isArray(res) ? res : res?.content ?? [];
  return rawList.map((item) => ({
    ...item,
    customerName: item.customerName || "Cliente",
    customerPhone: item.customerPhone || "9912345",
    employeeName: item.employeeName || "Profissional",
  }));
}

/**
 * Confirm a pending appointment (`POST /api/v1/appointments/{id}/confirm`).
 */
export async function confirmAppointment(
  appointmentId: string,
): Promise<SalonAppointment> {
  return api.post<SalonAppointment>(
    `/api/v1/appointments/${appointmentId}/confirm`,
    {},
    { tenant: true },
  );
}

/**
 * Mark an appointment as completed (`POST /api/v1/appointments/{id}/complete`).
 */
export async function completeAppointment(
  appointmentId: string,
): Promise<SalonAppointment> {
  return api.post<SalonAppointment>(
    `/api/v1/appointments/${appointmentId}/complete`,
    {},
    { tenant: true },
  );
}

/**
 * Accept a reschedule proposal (`POST /api/v1/appointments/{id}/reschedule/accept`).
 */
export async function acceptReschedule(
  appointmentId: string,
): Promise<SalonAppointment> {
  return api.post<SalonAppointment>(
    `/api/v1/appointments/${appointmentId}/reschedule/accept`,
    {},
    { tenant: true },
  );
}

/**
 * Reject a reschedule proposal (`POST /api/v1/appointments/{id}/reschedule/reject`).
 */
export async function rejectReschedule(
  appointmentId: string,
): Promise<SalonAppointment> {
  return api.post<SalonAppointment>(
    `/api/v1/appointments/${appointmentId}/reschedule/reject`,
    {},
    { tenant: true },
  );
}

/**
 * Salon admin cancellation (`POST /api/v1/appointments/{id}/cancel`).
 */
export async function cancelSalonAppointment(
  appointmentId: string,
  payload?: CancelAppointmentPayload,
): Promise<SalonAppointment> {
  return api.post<SalonAppointment>(
    `/api/v1/appointments/${appointmentId}/cancel`,
    payload ?? {},
    { tenant: true },
  );
}
