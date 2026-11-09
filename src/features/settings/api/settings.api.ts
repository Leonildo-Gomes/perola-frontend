import { api } from "@/lib/api/client";
import type {
  BusinessResponse,
  CreateBusinessPayload,
  UpdateBusinessPayload,
} from "../types/settings.types";

/**
 * Register a new business salon during onboarding (`POST /api/v1/businesses`).
 */
export async function createBusiness(
  payload: CreateBusinessPayload,
): Promise<BusinessResponse> {
  return api.post<BusinessResponse>("/api/v1/businesses", {
    ...payload,
    timezone: payload.timezone ?? "Atlantic/Cape_Verde",
  });
}

/**
 * Fetch business details by ID (`GET /api/v1/businesses/{id}`).
 */
export async function getBusiness(
  businessId: string,
  signal?: AbortSignal,
): Promise<BusinessResponse> {
  return api.get<BusinessResponse>(`/api/v1/businesses/${businessId}`, {
    tenant: true,
    signal,
  });
}

/**
 * Update business profile and settings (`PATCH /api/v1/businesses/{id}`).
 */
export async function updateBusiness(
  businessId: string,
  payload: UpdateBusinessPayload,
): Promise<BusinessResponse> {
  return api.patch<BusinessResponse>(
    `/api/v1/businesses/${businessId}`,
    payload,
    {
      tenant: true,
    },
  );
}

