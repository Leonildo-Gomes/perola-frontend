"use client";

import { configureApiClient } from "@/lib/api/client";
import { AUTH_STORAGE_KEY, useAuthStore } from "./auth-store";
import { TENANT_STORAGE_KEY, useTenantStore } from "./tenant-store";

let initialized = false;

/**
 * Hydrates the persisted stores, wires them into the HTTP client and keeps
 * them in sync across browser tabs. Idempotent; call from a client effect.
 */
export function initStores() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  configureApiClient({
    getAccessToken: () => useAuthStore.getState().accessToken,
    getRefreshToken: () => useAuthStore.getState().refreshToken,
    getActiveBusinessId: () => useTenantStore.getState().activeBusinessId,
    onTokensRefreshed: (tokens) => useAuthStore.getState().setTokens(tokens),
    onAuthFailure: () => useAuthStore.getState().logout(),
  });

  void useAuthStore.persist.rehydrate();
  void useTenantStore.persist.rehydrate();

  window.addEventListener("storage", (e) => {
    if (e.key === AUTH_STORAGE_KEY) void useAuthStore.persist.rehydrate();
    if (e.key === TENANT_STORAGE_KEY) void useTenantStore.persist.rehydrate();
  });
}
