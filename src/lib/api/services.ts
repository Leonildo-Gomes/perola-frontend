import type {
  CreateServicePayload,
  SalonEmployeeSummary,
  SalonService,
  UpdateServicePayload,
} from "@/features/services/types/service.types";
import { api } from "./client";

/**
 * List all services for a specific business (`GET /api/v1/businesses/{id}/services`).
 */
export async function getSalonServices(
  businessId: string,
  signal?: AbortSignal,
): Promise<SalonService[]> {
  return api.get<SalonService[]>(`/api/v1/businesses/${businessId}/services`, {
    tenant: true,
    signal,
  });
}

/**
 * Create a new service in the salon catalog (`POST /api/v1/businesses/{id}/services`).
 */
export async function createSalonService(
  businessId: string,
  payload: CreateServicePayload,
): Promise<SalonService> {
  return api.post<SalonService>(`/api/v1/businesses/${businessId}/services`, payload, {
    tenant: true,
  });
}

/**
 * Update an existing service (`PUT /api/v1/businesses/{id}/services/{serviceId}`).
 */
export async function updateSalonService(
  businessId: string,
  serviceId: string,
  payload: UpdateServicePayload,
): Promise<SalonService> {
  return api.put<SalonService>(
    `/api/v1/businesses/${businessId}/services/${serviceId}`,
    payload,
    { tenant: true },
  );
}

/**
 * Soft delete or deactivate a service (`DELETE /api/v1/businesses/{id}/services/{serviceId}`).
 */
export async function deleteSalonService(
  businessId: string,
  serviceId: string,
): Promise<void> {
  return api.delete<void>(
    `/api/v1/businesses/${businessId}/services/${serviceId}`,
    { tenant: true },
  );
}

/**
 * List salon employees / staff (`GET /api/v1/businesses/{id}/employees`).
 */
export async function getSalonEmployees(
  businessId: string,
  signal?: AbortSignal,
): Promise<SalonEmployeeSummary[]> {
  return api.get<SalonEmployeeSummary[]>(`/api/v1/businesses/${businessId}/employees`, {
    tenant: true,
    signal,
  });
}

/**
 * Get assigned services for an employee (`GET /api/v1/businesses/{id}/employees/{empId}/services`).
 */
export async function getEmployeeServices(
  businessId: string,
  employeeId: string,
  signal?: AbortSignal,
): Promise<string[]> {
  const result = await api.get<string[] | { serviceId: string }[] | SalonService[]>(
    `/api/v1/businesses/${businessId}/employees/${employeeId}/services`,
    { tenant: true, signal },
  );

  if (!Array.isArray(result)) return [];
  return result.map((item) => {
    if (typeof item === "string") return item;
    if ("serviceId" in item) return item.serviceId;
    return item.id;
  });
}

/**
 * Update assigned services for an employee (`PUT /api/v1/businesses/{id}/employees/{empId}/services`).
 */
export async function setEmployeeServices(
  businessId: string,
  employeeId: string,
  serviceIds: string[],
): Promise<void> {
  return api.put<void>(
    `/api/v1/businesses/${businessId}/employees/${employeeId}/services`,
    { serviceIds },
    { tenant: true },
  );
}

