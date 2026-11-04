"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

/** True once the persisted auth store has been rehydrated from localStorage. */
export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  return hydrated;
}
