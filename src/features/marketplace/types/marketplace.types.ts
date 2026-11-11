/** `CategoryResponse` (API.md). */
export interface MarketplaceCategory {
  id: string;
  slug: string;
  name: string;
  icon?: string | null;
  displayOrder: number;
}

/** `BusinessCategoryResponse` (API.md). */
export interface BusinessCategorySummary {
  id: string;
  slug: string;
  name: string;
  icon?: string | null;
  isPrimary: boolean;
}

/** `ServiceResponse` (API.md). */
export interface MarketplaceService {
  id: string;
  businessId: string;
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  /** Marketplace only lists active services; the field is absent in the real response. */
  isActive?: boolean;
  /** Denormalised business info returned by `/marketplace/services`. */
  businessName?: string;
  businessIsland?: string;
  businessCity?: string;
  imageUrl?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
}

/** `BusinessResponse` (API.md). */
export interface MarketplaceBusiness {
  id: string;
  ownerId: string;
  name: string;
  island: string;
  city: string;
  location: string;
  contactPhone: string;
  timezone: string;
  categories?: BusinessCategorySummary[];
  isActive: boolean;
  createdAt: string;
}

export interface MarketplaceFilters {
  query?: string;
  category?: string | null;
  island?: string | null;
  city?: string | null;
}
