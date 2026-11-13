import type { AppointmentStatus } from "@/features/bookings/types/booking.types";

export type { AppointmentStatus };

export type {
  AppointmentReview,
  CancelAppointmentPayload,
  CreateReviewPayload,
  CustomerAppointment,
  CustomerAppointmentsFilter,
  RescheduleAppointmentPayload,
} from "@/features/customers/types/customer.types";

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
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  employeeId?: string;
  status?: AppointmentStatus;
  page?: number;
  size?: number;
}

export interface CreateSalonAppointmentPayload {
  customerName: string;
  customerPhone: string;
  employeeId: string;
  serviceId: string;
  startTime: string;
  notes?: string;
}

