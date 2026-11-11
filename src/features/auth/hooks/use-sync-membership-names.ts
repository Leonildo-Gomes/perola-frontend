"use client";

import { useEffect, useRef } from "react";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { api } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";

async function fetchBusinessName(businessId: string): Promise<string | null> {
  try {
    const res = await api.get<{ name?: string }>(
      `/api/v1/businesses/${businessId}`,
      {
        tenant: false,
        headers: { "X-Business-Id": businessId },
      },
    );
    if (res?.name) return res.name;
  } catch {
    // Fallback to public marketplace business profile (e.g., if employee lacks private access)
  }

  try {
    const pub = await api.get<{ name?: string }>(
      `/api/v1/marketplace/businesses/${businessId}`,
      { skipAuth: true, tenant: false },
    );
    if (pub?.name) return pub.name;
  } catch {
    // Business might be inactive or unavailable; keep fallback label
  }

  return null;
}

/**
 * Hydrates missing `businessName` values in `authStore.memberships` when the
 * backend login response only returns `{ businessId, role }`.
 */
export function useSyncMembershipNames() {
  const hydrated = useAuthHydrated();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const memberships = useAuthStore((s) => s.memberships);
  const updateMembershipName = useAuthStore((s) => s.updateMembershipName);
  const attemptedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!hydrated || !isAuthenticated) {
      attemptedRef.current.clear();
      return;
    }

    const missing = memberships.filter(
      (m) => !m.businessName && !attemptedRef.current.has(m.businessId),
    );
    if (missing.length === 0) return;

    for (const m of missing) {
      attemptedRef.current.add(m.businessId);
      void fetchBusinessName(m.businessId).then((name) => {
        if (name) {
          updateMembershipName(m.businessId, name);
        }
      });
    }
  }, [hydrated, isAuthenticated, memberships, updateMembershipName]);
}

