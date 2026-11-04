"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getQueryClient } from "@/lib/query-client";
import type { BusinessRole } from "@/types/auth";

interface TenantState {
  activeBusinessId: string | null;
  activeBusinessName: string | null;
  userRoleInBusiness: BusinessRole | null;
  setActiveBusiness: (businessId: string, businessName: string | null, role: BusinessRole) => void;
  clearActiveBusiness: () => void;
}

export const TENANT_STORAGE_KEY = "perola-tenant";

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      activeBusinessId: null,
      activeBusinessName: null,
      userRoleInBusiness: null,
      setActiveBusiness: (businessId, businessName, role) => {
        const changed = get().activeBusinessId !== businessId;
        set({ activeBusinessId: businessId, activeBusinessName: businessName, userRoleInBusiness: role });
        // Tenant-scoped data must never leak across businesses.
        if (changed) void getQueryClient().invalidateQueries();
      },
      clearActiveBusiness: () =>
        set({ activeBusinessId: null, activeBusinessName: null, userRoleInBusiness: null }),
    }),
    {
      name: TENANT_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        activeBusinessId: s.activeBusinessId,
        activeBusinessName: s.activeBusinessName,
        userRoleInBusiness: s.userRoleInBusiness,
      }),
    },
  ),
);
