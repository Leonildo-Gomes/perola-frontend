"use client";

import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import type { ReactNode } from "react";

export function ProgressProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ProgressProvider
      height="3px"
      color="#0D9488"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}
