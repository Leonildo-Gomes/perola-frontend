/** `ServiceResponse` (API.md). Optional fields are display extensions the backend may add later. */
export interface MarketplaceService {
  id: string;
  businessId: string;
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
  isActive: boolean;
  createdAt: string;
}

export interface MarketplaceFilters {
  query?: string;
  category?: string | null;
  island?: string | null;
  city?: string | null;
}

