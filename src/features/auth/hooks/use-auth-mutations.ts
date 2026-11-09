"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi, type LoginPayload, type RegisterPayload } from "../api/auth.api";
import type { AuthResponse } from "../types/auth.types";

export function useLoginMutation() {
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (body: LoginPayload) => authApi.login(body),
  });
}

export function useRegisterMutation() {
  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: (body: RegisterPayload) => authApi.register(body),
  });
}

export function useGoogleAuthMutation() {
  return useMutation<AuthResponse, Error, string>({
    mutationFn: (idToken: string) => authApi.google(idToken),
  });
}

