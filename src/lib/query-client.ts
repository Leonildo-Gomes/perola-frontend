import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 },
    },
  });
}

let browserClient: QueryClient | undefined;

/** Server: new client per request. Browser: singleton (shared with the stores). */
export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") return makeQueryClient();
  return (browserClient ??= makeQueryClient());
}
