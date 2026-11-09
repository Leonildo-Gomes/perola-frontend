"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getQueryClient } from "@/lib/query-client";
import type { TokenPair } from "@/types/api";
import type { AuthResponse, BusinessMembership, UserProfile } from "@/features/auth/types/auth.types";
import { authStorage, setRememberSession } from "./auth-storage";
import { useTenantStore } from "./tenant-store";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  memberships: BusinessMembership[];
  isAuthenticated: boolean;
  login: (response: AuthResponse, remember?: boolean) => void;
  setTokens: (tokens: TokenPair) => void;
  updateUser: (user: Partial<UserProfile>) => void;
  addMembership: (membership: BusinessMembership) => void;
  logout: () => void;
}

export const AUTH_STORAGE_KEY = "perola-auth";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      memberships: [],
      isAuthenticated: false,
      login: ({ accessToken, refreshToken, user }, remember = true) => {
        setRememberSession(remember);
        const { businesses = [], ...profile } = user;
        const memberships: BusinessMembership[] = businesses.map((b) => ({
          businessId: b.businessId,
          role: b.role,
          businessName: b.businessName,
        }));
        set({ accessToken, refreshToken, user: profile, memberships, isAuthenticated: true });

        // Keep the active tenant only if the user still belongs to it; otherwise pick the first.
        const tenant = useTenantStore.getState();
        const current = memberships.find((m) => m.businessId === tenant.activeBusinessId);
        const next = current ?? memberships[0];
        if (next) tenant.setActiveBusiness(next.businessId, next.businessName ?? null, next.role);
        else tenant.clearActiveBusiness();
      },
      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
      updateUser: (patch) => set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
      addMembership: (membership) =>
        set((s) => ({
          memberships: s.memberships.some((m) => m.businessId === membership.businessId)
            ? s.memberships
            : [...s.memberships, membership],
        })),
      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null, memberships: [], isAuthenticated: false });
        useTenantStore.getState().clearActiveBusiness();
        const qc = getQueryClient();
        void qc.cancelQueries();
        qc.clear();
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => authStorage),
      skipHydration: true,
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        user: s.user,
        memberships: s.memberships,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
);
