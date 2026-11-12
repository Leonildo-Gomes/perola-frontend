export type EmployeeRole = "OWNER" | "EMPLOYEE";

/** Raw payload returned by `/api/v1/businesses/{id}/employees`. */
export interface EmployeeApiDto {
  id: string;
  businessId: string;
  userId?: string | null;
  displayName: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  accessRole?: EmployeeRole | null;
  specialty?: string | null;
  assignedServiceIds?: string[] | null;
  isActive: boolean;
  isOwner?: boolean;
  rating?: number | null;
  reviewCount?: number | null;
  workingHoursSummary?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Employee {
  id: string;
  businessId: string;
  userId?: string | null;
  displayName: string;
  specialty?: string | null; // e.g. "Cabeleireira Sénior & Trancista"
  accessRole?: EmployeeRole; // System permission level: OWNER or EMPLOYEE
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  isOwner?: boolean;
  rating?: number | null;
  reviewCount?: number | null;
  assignedServiceIds: string[];
  workingHoursSummary?: string | null; // e.g. "08:00 - 18:00 (Ter - Sáb)"
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeePayload {
  displayName: string;
  specialty?: string;
  accessRole?: EmployeeRole;
  phone: string;
  email?: string;
  avatarUrl?: string | null;
  assignedServiceIds?: string[];
}

export interface UpdateEmployeePayload {
  displayName?: string;
  specialty?: string;
  accessRole?: EmployeeRole;
  phone?: string;
  email?: string;
  avatarUrl?: string | null;
  isActive?: boolean;
  assignedServiceIds?: string[];
}
