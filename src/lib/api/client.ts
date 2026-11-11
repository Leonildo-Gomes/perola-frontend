import type { TokenPair } from "@/types/api.types";
import {
  ApiError,
  NetworkError,
  SlotConflictError,
  isSlotConflictProblem,
} from "./errors";

export * from "./errors";

/**
 * Empty (default) = same-origin: requests go to `/api/v1/*` and Next proxies them to BACKEND_URL
 * (see next.config.ts), avoiding CORS. Set NEXT_PUBLIC_API_URL to call the API directly.
 */
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

function apiBase(): string {
  if (API_URL) return API_URL;
  return typeof window !== "undefined" ? window.location.origin : (process.env.BACKEND_URL ?? "http://localhost:8080");
}

/**
 * Session bridge. The client does not import the Zustand stores (FE-003);
 * the stores register themselves here, which avoids circular imports.
 */
export interface ApiSessionHandlers {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getActiveBusinessId: () => string | null;
  /** Called after a successful refresh so the auth store persists the new tokens. */
  onTokensRefreshed: (tokens: TokenPair) => void;
  /** Called when refresh fails: must clear the auth store. Redirect to /login follows. */
  onAuthFailure: () => void;
}

let handlers: Partial<ApiSessionHandlers> = {};

export function configureApiClient(next: Partial<ApiSessionHandlers>) {
  handlers = { ...handlers, ...next };
}

/** URL prefixes of the `(admin)` route group (route groups don't appear in the URL). */
const ADMIN_PREFIXES = [
  "/dashboard",
  "/schedule",
  "/services",
  "/employee",
  "/team",
  "/availability",
  "/settings",
  "/onboarding",
];

function isAdminRoute(): boolean {
  if (typeof window === "undefined") return false;
  const p = window.location.pathname;
  return ADMIN_PREFIXES.some((x) => p === x || p.startsWith(`${x}/`));
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** JSON-serialisable body (or FormData). */
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  /** Skip the Authorization header (public endpoints). */
  skipAuth?: boolean;
  /** Override automatic X-Business-Id detection (based on the current admin route). */
  tenant?: boolean;
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(`${apiBase()}${path.startsWith("/") ? path : `/${path}`}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function parseProblem(res: Response): Promise<ApiError> {
  let problem;
  try {
    const data = await res.json();
    if (data && typeof data === "object" && "title" in data) {
      problem = { type: "about:blank", ...data, status: data.status ?? res.status };
    }
  } catch {
    /* non-JSON body */
  }
  problem ??= { type: "about:blank", title: res.statusText || "Erro", status: res.status };
  return isSlotConflictProblem(problem) ? new SlotConflictError(problem) : new ApiError(problem);
}

// Single-flight refresh: concurrent 401s share one refresh call.
let refreshing: Promise<boolean> | null = null;

function refreshTokens(): Promise<boolean> {
  refreshing ??= (async () => {
    const refreshToken = handlers.getRefreshToken?.();
    if (!refreshToken) return false;
    try {
      const res = await fetch(buildUrl("/api/v1/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      handlers.onTokensRefreshed?.((await res.json()) as TokenPair);
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

function handleAuthFailure() {
  handlers.onAuthFailure?.();
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.assign(`/login?next=${next}`);
  }
}

async function send(path: string, opts: RequestOptions): Promise<Response> {
  const { body, query, skipAuth, tenant, headers: extra, ...init } = opts;
  const headers = new Headers(extra);
  headers.set("Accept", "application/json, application/problem+json");

  let payload: BodyInit | undefined;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    payload = JSON.stringify(body);
  }

  if (!skipAuth) {
    const token = handlers.getAccessToken?.();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  if (tenant ?? isAdminRoute()) {
    const businessId = handlers.getActiveBusinessId?.();
    if (businessId) headers.set("X-Business-Id", businessId);
  }

  try {
    return await fetch(buildUrl(path, query), { ...init, headers, body: payload });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new NetworkError(e);
  }
}

export async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  let res = await send(path, opts);

  if (res.status === 401 && !opts.skipAuth) {
    if (await refreshTokens()) {
      res = await send(path, opts); // retry once with the new token
    }
    if (res.status === 401) {
      handleAuthFailure();
      throw await parseProblem(res);
    }
  }

  if (!res.ok) throw await parseProblem(res);
  if (res.status === 204 || res.headers.get("content-length") === "0") return undefined as T;
  return (await res.json()) as T;
}

type Opts = Omit<RequestOptions, "method" | "body">;

export const api = {
  get: <T>(path: string, opts?: Opts) => request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: Opts) =>
    request<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: Opts) =>
    request<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, opts?: Opts) =>
    request<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: Opts) => request<T>(path, { ...opts, method: "DELETE" }),
};
