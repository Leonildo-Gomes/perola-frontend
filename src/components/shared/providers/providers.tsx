"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSyncMembershipNames } from "@/features/auth/hooks/use-sync-membership-names";
import { getQueryClient } from "@/lib/react-query/query-client";
import { initStores } from "@/stores/bridge";

function MembershipNameSync() {
  useSyncMembershipNames();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  useEffect(() => {
    initStores();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <MembershipNameSync />
      {children}
    </QueryClientProvider>
  );
}
