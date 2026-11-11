"use client";

import {
  CalendarCheck,
  Check,
  ChevronDown,
  Compass,
  LogOut,
  Store,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  canAccessAdminRoute,
  getBusinessRoleLabel,
  getDefaultAdminRoute,
} from "@/features/auth/utils/permissions";
import type { BusinessMembership } from "@/features/auth/types/auth.types";
import { useLogout } from "@/hooks/use-logout";
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";

interface ProfileSwitcherProps {
  /** `public`: compact brand pill for marketplace/customer header. `admin`: avatar + name + role for TenantBar. */
  variant?: "public" | "admin";
}

function getMembershipDisplayName(m: BusinessMembership): string {
  return m.businessName ?? `Salão ${m.businessId.slice(0, 6)}`;
}

export function ProfileSwitcher({ variant = "public" }: ProfileSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout();

  const user = useAuthStore((s) => s.user);
  const memberships = useAuthStore((s) => s.memberships);
  const activePersona = useAuthStore((s) => s.activePersona);
  const setActivePersona = useAuthStore((s) => s.setActivePersona);

  const activeBusinessId = useTenantStore((s) => s.activeBusinessId);
  const activeRole = useTenantStore((s) => s.userRoleInBusiness);
  const setActiveBusiness = useTenantStore((s) => s.setActiveBusiness);

  const firstName = user?.name?.trim().split(" ")[0] ?? "Conta";
  const initial = user?.name?.trim().charAt(0).toUpperCase() ?? "?";
  const roleLabel = getBusinessRoleLabel(activeRole);

  const isInCustomerContext =
    activePersona === "CUSTOMER" ||
    pathname === "/" ||
    pathname.startsWith("/explore") ||
    pathname.startsWith("/book") ||
    pathname.startsWith("/my-bookings");

  const handleSwitchToCustomer = (targetPath: string) => {
    setActivePersona("CUSTOMER");
    router.push(targetPath);
  };

  const handleSwitchToBusiness = (m: BusinessMembership) => {
    setActiveBusiness(m.businessId, m.businessName ?? null, m.role);
    setActivePersona("BUSINESS");

    const isAlreadyInAdmin =
      pathname.startsWith("/schedule") ||
      pathname.startsWith("/services") ||
      pathname.startsWith("/employee") ||
      pathname.startsWith("/availability") ||
      pathname.startsWith("/settings") ||
      pathname.startsWith("/dashboard");

    if (isAlreadyInAdmin && canAccessAdminRoute(m.role, pathname)) {
      router.refresh();
      return;
    }

    router.push(getDefaultAdminRoute(m.role));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "admin" ? (
          <button
            type="button"
            aria-label="Menu do utilizador e troca de perfil"
            className="flex min-h-[44px] items-center gap-3 rounded-xl px-2 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perola-deep"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-perola-deep text-sm font-bold text-white">
              {initial}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-slate-900">
                {user?.name}
              </span>
              {roleLabel && (
                <span className="text-xs text-slate-500">{roleLabel}</span>
              )}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            aria-label="A minha conta e troca de perfil"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-perola-deep px-4 text-sm font-semibold text-white transition-colors hover:bg-perola-deep-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perola-deep focus-visible:ring-offset-2"
          >
            <User className="h-4 w-4 shrink-0" aria-hidden />
            <span className="max-w-[7.5rem] truncate">{firstName}</span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-85" aria-hidden />
          </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 rounded-2xl p-1.5">
        <DropdownMenuLabel className="px-2.5 py-2">
          <p className="truncate text-sm font-bold text-slate-900">
            {user?.name}
          </p>
          <p className="truncate text-xs font-normal text-slate-500">
            {user?.email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Modo Cliente
        </DropdownMenuLabel>

        <DropdownMenuItem
          className="min-h-[44px] cursor-pointer justify-between rounded-xl px-2.5"
          onSelect={() => handleSwitchToCustomer("/my-bookings")}
        >
          <span className="flex items-center gap-2.5">
            <CalendarCheck className="h-4 w-4 text-perola-deep" aria-hidden />
            <span className="font-medium text-slate-800">Minhas Marcações</span>
          </span>
          {isInCustomerContext && pathname.startsWith("/my-bookings") && (
            <Check className="h-4 w-4 text-perola-deep" aria-hidden />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="min-h-[44px] cursor-pointer justify-between rounded-xl px-2.5"
          onSelect={() => handleSwitchToCustomer("/explore")}
        >
          <span className="flex items-center gap-2.5">
            <Compass className="h-4 w-4 text-slate-500" aria-hidden />
            <span className="font-medium text-slate-800">
              Explorar Serviços
            </span>
          </span>
          {isInCustomerContext &&
            (pathname === "/" || pathname.startsWith("/explore")) && (
              <Check className="h-4 w-4 text-perola-deep" aria-hidden />
            )}
        </DropdownMenuItem>

        {memberships.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Os meus Salões (Profissional)
            </DropdownMenuLabel>

            {memberships.map((m) => {
              const isSelected =
                !isInCustomerContext &&
                activePersona === "BUSINESS" &&
                activeBusinessId === m.businessId;

              return (
                <DropdownMenuItem
                  key={m.businessId}
                  className="min-h-[44px] cursor-pointer justify-between rounded-xl px-2.5"
                  onSelect={() => handleSwitchToBusiness(m)}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Store
                      className="h-4 w-4 shrink-0 text-perola-deep"
                      aria-hidden
                    />
                    <span className="flex min-w-0 flex-col leading-tight">
                      <span className="truncate font-semibold text-slate-900">
                        {getMembershipDisplayName(m)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {getBusinessRoleLabel(m.role)}
                      </span>
                    </span>
                  </span>
                  {isSelected && (
                    <Check
                      className="h-4 w-4 shrink-0 text-perola-deep"
                      aria-hidden
                    />
                  )}
                </DropdownMenuItem>
              );
            })}
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="min-h-[44px] cursor-pointer rounded-xl px-2.5 text-rose-600 focus:bg-rose-50 focus:text-rose-700"
          onSelect={logout}
        >
          <LogOut className="mr-2.5 h-4 w-4" aria-hidden />
          Terminar sessão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

