import { api } from "@/lib/api/client";
import type {
  CreateEmployeePayload,
  Employee,
  EmployeeApiDto,
  UpdateEmployeePayload,
} from "../types/employee.types";

function sanitizeAvatarUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }
  return null;
}

export function mapEmployeeResponse(raw: EmployeeApiDto): Employee {
  const accessRole =
    raw.accessRole ?? (raw.isOwner ? "OWNER" : "EMPLOYEE");

  return {
    id: raw.id,
    businessId: raw.businessId,
    userId: raw.userId ?? null,
    displayName: raw.displayName,
    specialty: raw.specialty ?? null,
    accessRole,
    email: raw.email ?? null,
    phone: raw.phone ?? null,
    avatarUrl: sanitizeAvatarUrl(raw.avatarUrl),
    isActive: Boolean(raw.isActive),
    isOwner: accessRole === "OWNER" || Boolean(raw.isOwner),
    rating: raw.rating ?? null,
    reviewCount: raw.reviewCount ?? null,
    assignedServiceIds: Array.isArray(raw.assignedServiceIds)
      ? raw.assignedServiceIds
      : [],
    workingHoursSummary: raw.workingHoursSummary ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

/**
 * List all employees / staff members for a specific salon business (`GET /api/v1/businesses/{id}/employees`).
 */
export async function getEmployees(
  businessId: string,
  signal?: AbortSignal,
): Promise<Employee[]> {
  const res = await api.get<EmployeeApiDto[] | EmployeeApiDto[][]>(
    `/api/v1/businesses/${businessId}/employees`,
    {
      tenant: true,
      signal,
    },
  );

  if (!Array.isArray(res)) return [];
  const flatList = Array.isArray(res[0])
    ? (res as EmployeeApiDto[][]).flat()
    : (res as EmployeeApiDto[]);

  return flatList.map(mapEmployeeResponse);
}

/**
 * Get a single employee details (`GET /api/v1/businesses/{id}/employees/{empId}`).
 */
export async function getEmployee(
  businessId: string,
  employeeId: string,
  signal?: AbortSignal,
): Promise<Employee> {
  const res = await api.get<EmployeeApiDto>(
    `/api/v1/businesses/${businessId}/employees/${employeeId}`,
    {
      tenant: true,
      signal,
    },
  );
  return mapEmployeeResponse(res);
}

/**
 * Add a new employee to the team (`POST /api/v1/businesses/{id}/employees`).
 */
export async function createEmployee(
  businessId: string,
  payload: CreateEmployeePayload,
): Promise<Employee> {
  const res = await api.post<EmployeeApiDto>(
    `/api/v1/businesses/${businessId}/employees`,
    payload,
    { tenant: true },
  );
  const mapped = mapEmployeeResponse(res);

  // If services were selected upon creation and backend didn't persist them inline, associate them immediately
  if (
    payload.assignedServiceIds &&
    payload.assignedServiceIds.length > 0 &&
    mapped.id &&
    mapped.assignedServiceIds.length === 0
  ) {
    try {
      await updateEmployeeServices(
        businessId,
        mapped.id,
        payload.assignedServiceIds,
      );
      mapped.assignedServiceIds = payload.assignedServiceIds;
    } catch {
      // Non-fatal if initial assignment fails
    }
  }

  return mapped;
}

/**
 * Update an existing employee's profile or status (`PATCH /api/v1/businesses/{id}/employees/{empId}`).
 */
export async function updateEmployee(
  businessId: string,
  employeeId: string,
  payload: UpdateEmployeePayload,
): Promise<Employee> {
  const res = await api.patch<EmployeeApiDto>(
    `/api/v1/businesses/${businessId}/employees/${employeeId}`,
    payload,
    { tenant: true },
  );
  const mapped = mapEmployeeResponse(res);

  // If assignedServiceIds is passed, ensure employee-service associations stay in sync
  if (payload.assignedServiceIds !== undefined) {
    await updateEmployeeServices(
      businessId,
      employeeId,
      payload.assignedServiceIds,
    );
    mapped.assignedServiceIds = payload.assignedServiceIds;
  }

  return mapped;
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
 * Change or toggle employee active status (`POST /api/v1/businesses/{id}/employees/{empId}/status`).
 */
export async function changeEmployeeStatus(
  businessId: string,
  employeeId: string,
): Promise<void> {
  return api.post<void>(
    `/api/v1/businesses/${businessId}/employees/${employeeId}/status`,
    undefined,
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

export {
  getEmployeeAssignedServices as getEmployeeServices,
  updateEmployeeServices as setEmployeeServices,
};
