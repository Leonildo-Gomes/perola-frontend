export interface CreateBusinessPayload {
  name: string;
  island: string;
  city: string;
  location: string;
  contactPhone: string;
  timezone?: string;
}

export interface UpdateBusinessPayload {
  name?: string;
  island?: string;
  city?: string;
  location?: string;
  contactPhone?: string;
  timezone?: string;
  isActive?: boolean;
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
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

