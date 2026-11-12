import { api } from "@/lib/api/client";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UpdateUserProfilePayload,
  UserProfile,
} from "../types/auth.types";

export type { LoginPayload, RegisterPayload, UpdateUserProfilePayload };

// Public endpoints: skipAuth avoids the refresh-on-401 flow for bad credentials.
export const authApi = {
  login: (body: LoginPayload) =>
    api.post<AuthResponse>("/api/v1/auth/login", body, { skipAuth: true }),
  register: (body: RegisterPayload) =>
    api.post<AuthResponse>("/api/v1/auth/register", body, { skipAuth: true }),
  google: (idToken: string) =>
    api.post<AuthResponse>("/api/v1/auth/google", { idToken }, { skipAuth: true }),
  getMe: () => api.get<UserProfile>("/api/v1/users/me", { tenant: false }),
  updateProfile: (body: UpdateUserProfilePayload) =>
    api.patch<UserProfile>("/api/v1/users/me", body, { tenant: false }),
};

