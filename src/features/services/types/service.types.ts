export type ServiceCategory =
  | "CABELO"
  | "UNHAS"
  | "BARBEARIA"
  | "ESTETICA"
  | "MASSAGEM"
  | "OUTRO";

export interface ServiceCategoryOption {
  value: ServiceCategory;
  label: string;
}

export const SERVICE_CATEGORIES: ServiceCategoryOption[] = [
  { value: "CABELO", label: "Cabelo" },
  { value: "UNHAS", label: "Unhas" },
  { value: "BARBEARIA", label: "Barbearia" },
  { value: "ESTETICA", label: "Estética" },
  { value: "MASSAGEM", label: "Massagem" },
  { value: "OUTRO", label: "Outro" },
];

export interface SalonService {
  id: string;
  businessId: string;
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
  name: string;
  category?: ServiceCategory | string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  imageUrl?: string | null;
  isActive: boolean;
  assignedEmployeeIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServicePayload {
  categoryId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  imageUrl?: string | null;
}

export interface UpdateServicePayload {
  categoryId?: string;
  name?: string;
  description?: string;
  durationMinutes?: number;
  price?: number;
  imageUrl?: string | null;
  isActive?: boolean;
}

export interface SalonEmployeeSummary {
  id: string;
  businessId: string;
  displayName: string;
  specialty?: string | null;
  accessRole?: "OWNER" | "EMPLOYEE";
  avatarUrl?: string | null;
  isActive: boolean;
  assignedServiceIds?: string[];
}
