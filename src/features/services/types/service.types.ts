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
    name: string;
    category?: ServiceCategory | string;
    description?: string | null;
    durationMinutes: number;
    price: number;
    isActive: boolean;
    assignedEmployeeIds?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateServicePayload {
    name: string;
    category?: string;
    description?: string;
    durationMinutes: number;
    price: number;
}

export interface UpdateServicePayload {
    name?: string;
    category?: string;
    description?: string;
    durationMinutes?: number;
    price?: number;
    isActive?: boolean;
}

export interface SalonEmployeeSummary {
    id: string;
    businessId: string;
    displayName: string;
    role?: string;
    avatarUrl?: string | null;
    isActive: boolean;
    assignedServiceIds?: string[];
}

