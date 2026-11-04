"use client";

import { useEffect, useState } from "react";
import { useLocationStore } from "@/stores/location-store";

/** True once the persisted location has been rehydrated (avoids a wasted first fetch). */
export function useLocationHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useLocationStore.persist.hasHydrated()) setHydrated(true);
    return useLocationStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  return hydrated;
}
