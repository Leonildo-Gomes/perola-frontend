"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LocationState {
  island: string | null;
  city: string | null;
  setLocation: (island: string | null, city: string | null) => void;
}

export const LOCATION_STORAGE_KEY = "perola-location";

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      island: null,
      city: null,
      setLocation: (island, city) => set({ island, city }),
    }),
    {
      name: LOCATION_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
