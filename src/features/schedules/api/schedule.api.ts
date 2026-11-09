import { api } from "@/lib/api/client";
import type { Page } from "@/types/api";
import type {
  CancelAppointmentPayload,
  CreateSalonAppointmentPayload,
  SalonAppointment,
  SalonAppointmentsFilter,
} from "../types/schedule.types";

export {
  getMyAppointments,
  requestReschedule,
  cancelAppointment,
  submitReview,
} from "@/features/customers/api/customer.api";

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

/**
 * Create a new operational salon appointment (`POST /api/v1/appointments`).
 */
export async function createSalonAppointment(
  businessId: string,
  payload: CreateSalonAppointmentPayload,
): Promise<SalonAppointment> {
  return api.post<SalonAppointment>(
    "/api/v1/appointments",
    {
      businessId,
      ...payload,
    },
    { tenant: true },
  );
}

