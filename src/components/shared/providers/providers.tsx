"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { getQueryClient } from "@/lib/react-query/query-client";
import { initStores } from "@/stores/bridge";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  useEffect(() => {
    initStores();
  }, []);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
