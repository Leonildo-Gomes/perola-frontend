export type EmployeeRole = "OWNER" | "EMPLOYEE";

export interface Employee {
  id: string;
  businessId: string;
  userId?: string | null;
  displayName: string;
  role?: string; // Specialty description, e.g. "Cabeleireira Sénior", "Barbeiro & Estilo"
  accessRole?: EmployeeRole; // System permission level: OWNER or EMPLOYEE
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  isOwner?: boolean;
  rating?: number | null;
  reviewCount?: number | null;
  assignedServiceIds?: string[];
  workingHoursSummary?: string | null; // e.g. "08:00 - 18:00 (Ter - Sáb)"
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeePayload {
  displayName: string;
  role?: string;
  accessRole?: EmployeeRole;
  phone: string;
  email?: string;
  avatarUrl?: string;
  assignedServiceIds?: string[];
}

export interface UpdateEmployeePayload {
  displayName?: string;
  role?: string;
  accessRole?: EmployeeRole;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  isActive?: boolean;
  assignedServiceIds?: string[];
}

