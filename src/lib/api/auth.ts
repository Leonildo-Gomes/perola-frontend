import type { AuthResponse } from "@/types/auth";
import { api } from "./client";

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

// Public endpoints: skipAuth avoids the refresh-on-401 flow for bad credentials.
export const authApi = {
  login: (body: LoginPayload) => api.post<AuthResponse>("/api/v1/auth/login", body, { skipAuth: true }),
  register: (body: RegisterPayload) => api.post<AuthResponse>("/api/v1/auth/register", body, { skipAuth: true }),
  google: (idToken: string) => api.post<AuthResponse>("/api/v1/auth/google", { idToken }, { skipAuth: true }),
};
