import { api } from "@/lib/api/client";
import type {
  CreateEmployeePayload,
  Employee,
  UpdateEmployeePayload,
} from "../types/employee.types";

/**
 * List all employees / staff members for a specific salon business (`GET /api/v1/businesses/{id}/employees`).
 */
export async function getEmployees(
  businessId: string,
  signal?: AbortSignal,
): Promise<Employee[]> {
  return api.get<Employee[]>(`/api/v1/businesses/${businessId}/employees`, {
    tenant: true,
    signal,
  });
}

/**
 * Get a single employee details (`GET /api/v1/businesses/{id}/employees/{empId}`).
 */
export async function getEmployee(
  businessId: string,
  employeeId: string,
  signal?: AbortSignal,
): Promise<Employee> {
  return api.get<Employee>(
    `/api/v1/businesses/${businessId}/employees/${employeeId}`,
    {
      tenant: true,
      signal,
    },
  );
}

/**
 * Add a new employee to the team (`POST /api/v1/businesses/{id}/employees`).
 */
export async function createEmployee(
  businessId: string,
  payload: CreateEmployeePayload,
): Promise<Employee> {
  const result = await api.post<Employee>(
    `/api/v1/businesses/${businessId}/employees`,
    payload,
    { tenant: true },
  );

  // If services were selected upon creation, associate them immediately
  if (payload.assignedServiceIds && payload.assignedServiceIds.length > 0 && result.id) {
    try {
      await updateEmployeeServices(businessId, result.id, payload.assignedServiceIds);
      result.assignedServiceIds = payload.assignedServiceIds;
    } catch {
      // Non-fatal if initial assignment fails
    }
  }

  return result;
}

/**
 * Update an existing employee's profile or status (`PATCH /api/v1/businesses/{id}/employees/{empId}`).
 */
export async function updateEmployee(
  businessId: string,
  employeeId: string,
  payload: UpdateEmployeePayload,
): Promise<Employee> {
  const result = await api.patch<Employee>(
    `/api/v1/businesses/${businessId}/employees/${employeeId}`,
    payload,
    { tenant: true },
  );

  // If assignedServiceIds is passed, update employee-service associations
  if (payload.assignedServiceIds !== undefined) {
    await updateEmployeeServices(businessId, employeeId, payload.assignedServiceIds);
    result.assignedServiceIds = payload.assignedServiceIds;
  }

  return result;
}

/**
 * Deactivate or remove an employee (`DELETE /api/v1/businesses/{id}/employees/{empId}`).
 */
export async function deleteEmployee(
  businessId: string,
  employeeId: string,
): Promise<void> {
  return api.delete<void>(
    `/api/v1/businesses/${businessId}/employees/${employeeId}`,
    { tenant: true },
  );
}

/**
 * Get service IDs assigned to an employee (`GET /api/v1/businesses/{id}/employees/{empId}/services`).
 */
export async function getEmployeeAssignedServices(
  businessId: string,
  employeeId: string,
  signal?: AbortSignal,
): Promise<string[]> {
  const result = await api.get<string[] | { serviceId: string; id?: string }[]>(
    `/api/v1/businesses/${businessId}/employees/${employeeId}/services`,
    { tenant: true, signal },
  );

  if (!Array.isArray(result)) return [];
  return result
    .map((item) => {
      if (typeof item === "string") return item;
      return item.serviceId || item.id || "";
    })
    .filter(Boolean);
}

/**
 * Update services assigned to an employee (`PUT /api/v1/businesses/{id}/employees/{empId}/services`).
 */
export async function updateEmployeeServices(
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

