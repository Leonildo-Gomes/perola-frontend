import type { AuthResponse } from "@/types/auth";

/** Accept only same-origin relative paths (prevents open redirects). */
export function safeReturnUrl(url: string | null | undefined): string | null {
  if (!url || !url.startsWith("/") || url.startsWith("//") || url.startsWith("/\\")) return null;
  return url;
}

/** Smart post-authentication destination (FRONTEND_SPEC §4.12). */
export function resolvePostAuthRoute(
  user: AuthResponse["user"],
  returnUrl?: string | null,
  options: { forceOnboarding?: boolean } = {},
): string {
  const hasBusiness = (user.businesses?.length ?? 0) > 0;
  if (options.forceOnboarding && !hasBusiness) return "/onboarding";
  const safe = safeReturnUrl(returnUrl);
  if (safe) return safe;

  const isOwner = user.roles?.includes("OWNER") || user.businesses?.some((b) => b.role === "OWNER");
  const isEmployee = user.roles?.includes("EMPLOYEE") || user.businesses?.some((b) => b.role === "EMPLOYEE");
  if (isOwner) return hasBusiness ? "/schedule" : "/onboarding";
  if (isEmployee) return "/schedule";
  return "/explore";
}
