"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { AdminBottomNav } from "./admin-bottom-nav";
import { AdminSidebar } from "./admin-sidebar";
import { TenantBar } from "./tenant-bar";

/** Client shell for `(admin)`: session guard + TenantBar + collapsible sidebar. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, isAuthenticated, pathname, router]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col gap-4 bg-slate-50 p-4" aria-busy="true" aria-label="A carregar">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  // Onboarding is a focused, distraction-free flow without regular dashboard navigation
  if (pathname === "/onboarding") {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TenantBar sidebarCollapsed={collapsed} onToggleSidebar={() => setCollapsed((c) => !c)} />
      <div className="flex">
        <aside
          className={cn(
            "sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-4 transition-[width] md:block",
            collapsed ? "w-[72px]" : "w-60",
          )}
        >
          <AdminSidebar collapsed={collapsed} />
        </aside>
        <main className="min-w-0 flex-1 p-4 pb-24 md:p-6 md:pb-6">{children}</main>
      </div>
      <AdminBottomNav />
    </div>
  );
}
