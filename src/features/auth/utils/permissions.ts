import type { BusinessRole } from "../types/auth.types";

export interface AdminRouteRule {
  prefix: string;
  allowedRoles: readonly BusinessRole[];
}

/** Route-level RBAC rules inside `(admin)` SaaS panel. */
export const ADMIN_ROUTE_RULES: readonly AdminRouteRule[] = [
  { prefix: "/dashboard", allowedRoles: ["OWNER"] },
  { prefix: "/schedule", allowedRoles: ["OWNER", "EMPLOYEE"] },
  { prefix: "/services", allowedRoles: ["OWNER"] },
  { prefix: "/employee", allowedRoles: ["OWNER"] },
  { prefix: "/availability", allowedRoles: ["OWNER", "EMPLOYEE"] },
  { prefix: "/settings", allowedRoles: ["OWNER"] },
];

/** Default route when switching to a business profile. */
export function getDefaultAdminRoute(role: BusinessRole | null): string {
  if (!role) return "/onboarding";
  return "/schedule";
}

/** Check if the user's role in the active business grants access to `pathname`. */
export function canAccessAdminRoute(
  role: BusinessRole | null,
  pathname: string,
): boolean {
  if (pathname === "/onboarding" || pathname.startsWith("/onboarding/")) {
    return true;
  }
  if (!role) return false;

  const matchedRule = ADMIN_ROUTE_RULES.find(
    (rule) =>
      pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`),
  );

  if (!matchedRule) return true;
  return matchedRule.allowedRoles.includes(role);
}

/** Human-readable Portuguese label for business role. */
export function getBusinessRoleLabel(role: BusinessRole | null): string | null {
  if (role === "OWNER") return "Proprietário";
  if (role === "EMPLOYEE") return "Colaborador";
  return null;
}

