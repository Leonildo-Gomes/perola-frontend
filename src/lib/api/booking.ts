import type { Page } from "@/types/api";
import type {
  AppointmentResponse,
  AvailabilitySlotsResponse,
  BookingTarget,
  CreateAppointmentRequest,
  PublicBusinessProfile,
} from "@/types/booking";
import type { MarketplaceService } from "@/types/marketplace";
import { api } from "./client";

const PUBLIC = { skipAuth: true, tenant: false } as const;

export const getBusinessProfile = (businessId: string, signal?: AbortSignal) =>
  api.get<PublicBusinessProfile>(`/api/v1/marketplace/businesses/${businessId}`, { ...PUBLIC, signal });

/** There is no `GET /marketplace/services/{id}`: scan the public catalog when the businessId is unknown. */
async function findServiceBusinessId(serviceId: string, signal?: AbortSignal): Promise<string | null> {
  for (let page = 0; page < 10; page++) {
    const res = await api.get<Page<MarketplaceService>>("/api/v1/marketplace/services", {
      ...PUBLIC,
      signal,
      query: { page, size: 50 },
    });
    const hit = res.content.find((s) => s.id === serviceId);
    if (hit) return hit.businessId;
    if (page + 1 >= res.totalPages) break;
  }
  return null;
}

/** Service + business + active team for the wizard. `null` when the service is not bookable. */
export async function loadBookingTarget(
  serviceId: string,
  businessIdHint?: string | null,
  signal?: AbortSignal,
): Promise<BookingTarget | null> {
  const businessId = businessIdHint || (await findServiceBusinessId(serviceId, signal));
  if (!businessId) return null;
  const business = await getBusinessProfile(businessId, signal);
  const service = business.services.find((s) => s.id === serviceId && s.isActive !== false);
  if (!service) return null;
  return { business, service, employees: business.employees.filter((e) => e.isActive !== false) };
}

export interface SlotsParams {
  businessId: string;
  employeeId: string;
  serviceId: string;
  /** `YYYY-MM-DD` (Cape Verde). */
  date: string;
}

export const getSlots = (p: SlotsParams, signal?: AbortSignal) =>
  api.get<AvailabilitySlotsResponse>("/api/v1/availability/slots", { ...PUBLIC, signal, query: { ...p } });

export const createAppointment = (body: CreateAppointmentRequest) =>
  api.post<AppointmentResponse>("/api/v1/appointments", body, { tenant: false });

export const getAppointment = (id: string, signal?: AbortSignal) =>
  api.get<AppointmentResponse>(`/api/v1/appointments/${id}`, { tenant: false, signal });
