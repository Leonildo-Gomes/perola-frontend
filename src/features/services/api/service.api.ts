
import type { CreateServicePayload, SalonService, UpdateServicePayload } from "../types/service.types";
import { api } from "@/lib/api/client";


export async function getServices(
    businessId: string,
    signal?: AbortSignal,
): Promise<SalonService[]> {
    return api.get<SalonService[]>(`/api/v1/businesses/${businessId}/services`, {
        tenant: true,
        signal,
    });
}

export async function getService(
    businessId: string,
    serviceId: string,
    signal?: AbortSignal,
): Promise<SalonService> {
    return api.get<SalonService>(`/api/v1/businesses/${businessId}/services/${serviceId}`, {
        tenant: true,
        signal,
    });
}

export async function createService(
    businessId: string,
    payload: CreateServicePayload,
): Promise<SalonService> {
    return api.post<SalonService>(`/api/v1/businesses/${businessId}/services`, payload, {
        tenant: true,
    });
}

export async function updateService(
    businessId: string,
    serviceId: string,
    payload: UpdateServicePayload,
): Promise<SalonService> {
    return api.put<SalonService>(`/api/v1/businesses/${businessId}/services/${serviceId}`, payload, {
        tenant: true,
    });
}

export async function deleteService(
    businessId: string,
    serviceId: string,
): Promise<void> {
    return api.delete(`/api/v1/businesses/${businessId}/services/${serviceId}`, {
        tenant: true,
    });
}

export async function changeServiceStatus(
    businessId: string,
    serviceId: string,
): Promise<void> {
    return api.post(`/api/v1/businesses/${businessId}/services/${serviceId}/status`, {
        tenant: true,
    });
}

// Aliases for salon service operations
export { getServices as getSalonServices };
export { createService as createSalonService };
export { updateService as updateSalonService };
export { deleteService as deleteSalonService };

// Cross-feature re-exports needed by service assignment container
export {
    getEmployees as getSalonEmployees,
    getEmployeeServices,
    setEmployeeServices,
} from "@/features/employees/api/employee.api";
