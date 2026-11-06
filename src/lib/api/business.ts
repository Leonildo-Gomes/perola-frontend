import type { BusinessResponse, CreateBusinessPayload } from "@/types/business";
import { api } from "./client";

/**
 * Register a new business salon during onboarding (`POST /api/v1/businesses`).
 */
export async function createBusiness(payload: CreateBusinessPayload): Promise<BusinessResponse> {
  return api.post<BusinessResponse>("/api/v1/businesses", {
    ...payload,
    timezone: payload.timezone ?? "Atlantic/Cape_Verde",
  });
}

