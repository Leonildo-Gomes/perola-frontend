import type { AppointmentStatus } from "@/types/booking";

export type { AppointmentStatus };

export interface AppointmentReview {
  id: string;
  appointmentId: string;
  customerId: string;
  employeeId: string;
  rating: number; // 1 to 5
  comment?: string | null;
  createdAt: string;
}

/** Rich appointment representation for the Customer Portal. */
export interface CustomerAppointment {
  id: string;
  businessId: string;
  businessName?: string;
  businessCity?: string;
  businessIsland?: string;
  businessAddress?: string;
  businessPhone?: string;
  customerId: string;
  employeeId: string;
  employeeName?: string;
  employeeRole?: string;
  employeeAvatarUrl?: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  startTime: string; // ISO 8601 with offset
  endTime: string; // ISO 8601 with offset
  proposedStartTime?: string | null;
  proposedEndTime?: string | null;
  status: AppointmentStatus;
  notes?: string | null;
  createdAt: string;
  review?: AppointmentReview | null;
  receiptNumber?: string | null;
}

/** Operational appointment representation for Salon Admin Schedule. */
export interface SalonAppointment {
  id: string;
  businessId: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  employeeId: string;
  employeeName?: string;
  employeeRole?: string;
  employeeAvatarUrl?: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  startTime: string; // ISO 8601 with offset
  endTime: string; // ISO 8601 with offset
  proposedStartTime?: string | null;
  proposedEndTime?: string | null;
  status: AppointmentStatus;
  notes?: string | null;
  chairName?: string | null;
  createdAt: string;
}

export interface SalonAppointmentsFilter {
  date?: string; // YYYY-MM-DD
  employeeId?: string;
  status?: AppointmentStatus;
  page?: number;
  size?: number;
}

export interface CustomerAppointmentsFilter {
  status?: AppointmentStatus;
  page?: number;
  size?: number;
}

export interface CancelAppointmentPayload {
  reason?: string;
}

export interface RescheduleAppointmentPayload {
  proposedStartTime: string;
  reason?: string;
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

export interface CreateSalonAppointmentPayload {
  customerName: string;
  customerPhone: string;
  employeeId: string;
  serviceId: string;
  startTime: string;
  notes?: string;
}

