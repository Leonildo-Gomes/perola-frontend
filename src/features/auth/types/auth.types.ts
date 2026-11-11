export type UserRole = "CUSTOMER" | "OWNER" | "EMPLOYEE" | "ADMIN";

/** Role a user holds inside a specific business (tenant). */
export type BusinessRole = "OWNER" | "EMPLOYEE";

/** Current active UI context for multi-profile users. */
export type ActivePersona = "CUSTOMER" | "BUSINESS";

export interface BusinessMembership {
  businessId: string;
  role: BusinessRole;
  /** Display name, when the backend provides it. */
  businessName?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
  roles?: UserRole[];
}

/** Response of `POST /api/v1/auth/login|register|google` (API.md `AuthResponse`). */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile & {
    businesses?: { businessId: string; role: BusinessRole; businessName?: string }[];
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  /** Full international format, e.g. `+2389912345`. */
  phone: string;
  password: string;
}

