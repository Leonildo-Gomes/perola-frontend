"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  canAccessAdminRoute,
  getDefaultAdminRoute,
} from "@/features/auth/utils/permissions";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { cn } from "@/lib/utils/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import { AdminBottomNav } from "./admin-bottom-nav";
import { AdminSidebar } from "./admin-sidebar";
import { TenantBar } from "./tenant-bar";

/** Client shell for `(admin)`: session guard, RBAC route protection, TenantBar & sidebar. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthHydrated();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const memberships = useAuthStore((s) => s.memberships);
  const activePersona = useAuthStore((s) => s.activePersona);
  const setActivePersona = useAuthStore((s) => s.setActivePersona);

  const userRoleInBusiness = useTenantStore((s) => s.userRoleInBusiness);
  const setActiveBusiness = useTenantStore((s) => s.setActiveBusiness);

  const [collapsed, setCollapsed] = useState(false);

  const isOnboarding = pathname === "/onboarding" || pathname.startsWith("/onboarding/");
  const hasMemberships = memberships.length > 0;
  const isRouteAllowed =
    isOnboarding ||
    (hasMemberships && canAccessAdminRoute(userRoleInBusiness, pathname));

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isOnboarding) return;

    if (!hasMemberships) {
      toast.error("Esta área é reservada a profissionais e salões.");
      router.replace("/explore");
      return;
    }

    // Ensure active business and persona are synced if entering admin directly
    if (!userRoleInBusiness && memberships[0]) {
      const first = memberships[0];
      setActiveBusiness(first.businessId, first.businessName ?? null, first.role);
    }

    if (activePersona !== "BUSINESS") {
      setActivePersona("BUSINESS");
    }

    if (userRoleInBusiness && !canAccessAdminRoute(userRoleInBusiness, pathname)) {
      toast.error("Acesso restrito ao proprietário do salão.");
      router.replace(getDefaultAdminRoute(userRoleInBusiness));
    }
  }, [
    hydrated,
    isAuthenticated,
    isOnboarding,
    hasMemberships,
    memberships,
    userRoleInBusiness,
    activePersona,
    pathname,
    router,
    setActiveBusiness,
    setActivePersona,
  ]);

  if (!hydrated || !isAuthenticated || !isRouteAllowed) {
    return (
      <div
        className="flex min-h-screen flex-col gap-4 bg-slate-50 p-4"
        aria-busy="true"
        aria-label="A carregar"
      >
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  // Onboarding is a focused, distraction-free flow without regular dashboard navigation
  if (isOnboarding) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TenantBar
        sidebarCollapsed={collapsed}
        onToggleSidebar={() => setCollapsed((c) => !c)}
      />
      <div className="flex">
        <aside
          className={cn(
            "sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-4 transition-[width] md:block",
            collapsed ? "w-[72px]" : "w-60",
          )}
        >
          <AdminSidebar collapsed={collapsed} />
        </aside>
        <main className="min-w-0 flex-1 p-4 pb-24 md:p-6 md:pb-6">
          {children}
        </main>
      </div>
      <AdminBottomNav />
    </div>
  );
}
