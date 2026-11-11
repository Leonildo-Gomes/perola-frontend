export interface BusinessCategoryItemRequest {
  categoryId: string;
  isPrimary: boolean;
}

export interface BusinessCategoryResponse {
  id: string;
  slug: string;
  name: string;
  icon?: string | null;
  isPrimary: boolean;
}

export interface CreateBusinessPayload {
  name: string;
  island: string;
  city: string;
  location: string;
  contactPhone: string;
  timezone?: string;
  categories: BusinessCategoryItemRequest[];
}

export interface UpdateBusinessPayload {
  name?: string;
  island?: string;
  city?: string;
  location?: string;
  contactPhone?: string;
  timezone?: string;
  isActive?: boolean;
  categories?: BusinessCategoryItemRequest[];
}

export interface BusinessResponse {
  id: string;
  ownerId: string;
  name: string;
  island: string;
  city: string;
  location: string;
  contactPhone: string;
  timezone: string;
  categories?: BusinessCategoryResponse[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
