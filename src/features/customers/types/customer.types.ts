import type { AppointmentStatus } from "@/features/bookings/types/booking.types";

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

/** CRM Customer Classification Tiers per salon (V6 / Feature 001) */
export type CustomerTier = "NEW" | "REGULAR" | "RECURRENT" | "VIP" | "WARNING";

/** Salon CRM Customer representation (`GET /api/v1/businesses/{id}/customers`) */
export interface BusinessCustomer {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  hasRegisteredAccount: boolean;
  tier: CustomerTier;
  internalNotes?: string | null;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalSpentCve: number;
  lastAppointmentAt?: string | null;
  createdAt: string;
}

/** Full details with appointment history (`GET /api/v1/businesses/{id}/customers/{customerId}`) */
export interface BusinessCustomerDetail extends BusinessCustomer {
  recentAppointments?: CustomerAppointment[];
}

export interface BusinessCustomersFilter {
  search?: string;
  tier?: CustomerTier;
  page?: number;
  size?: number;
}

export interface UpdateBusinessCustomerPayload {
  tier?: CustomerTier;
  internalNotes?: string | null;
}

