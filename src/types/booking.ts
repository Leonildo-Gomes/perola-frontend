import type { MarketplaceService } from "./marketplace";

export interface PublicEmployee {
  id: string;
  businessId: string;
  displayName: string;
  isActive?: boolean;
}

/** `GET /api/v1/marketplace/businesses/{id}`: public profile with catalog and team. */
export interface PublicBusinessProfile {
  id: string;
  name: string;
  island: string;
  city: string;
  location: string;
  contactPhone: string;
  timezone: string;
  services: MarketplaceService[];
  employees: PublicEmployee[];
}

export interface BookingTarget {
  business: PublicBusinessProfile;
  service: MarketplaceService;
  employees: PublicEmployee[];
}

/** `GET /api/v1/availability/slots` */
export interface AvailabilitySlotsResponse {
  date: string;
  employeeId: string;
  serviceId: string;
  durationMinutes: number;
  slots: { startTime: string; endTime: string }[];
}

export interface SlotItem {
  /** ISO-8601 instant (the API returns it with the -01:00 offset). */
  startTime: string;
  /** "09:30" in Cape Verde time. */
  formattedTime: string;
  available: boolean;
  /** Professional that owns this slot (relevant for "any professional"). */
  employeeId: string;
}

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "RESCHEDULE_PENDING";

export interface CreateAppointmentRequest {
  businessId: string;
  employeeId: string;
  serviceId: string;
  startTime: string;
  notes?: string;
}

export interface AppointmentResponse {
  id: string;
  businessId: string;
  customerId: string;
  employeeId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  startTime: string;
  endTime: string;
  proposedStartTime?: string | null;
  proposedEndTime?: string | null;
  status: AppointmentStatus;
  notes?: string | null;
  createdAt: string;
}

/** Wizard choice: a specific professional or automatic assignment. */
export const ANY_EMPLOYEE = "any" as const;
