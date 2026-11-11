"use client";

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/shared/branding";
import { ProfileSwitcher } from "@/components/shared/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  canAccessAdminRoute,
  getBusinessRoleLabel,
  getDefaultAdminRoute,
} from "@/features/auth/utils/permissions";
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import { ActiveBusinessSelector } from "./active-business-selector";
import { AdminSidebar } from "./admin-sidebar";

interface TenantBarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function TenantBar({
  sidebarCollapsed,
  onToggleSidebar,
}: TenantBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const memberships = useAuthStore((s) => s.memberships);
  const setActivePersona = useAuthStore((s) => s.setActivePersona);

  const activeBusinessId = useTenantStore((s) => s.activeBusinessId);
  const role = useTenantStore((s) => s.userRoleInBusiness);
  const setActiveBusiness = useTenantStore((s) => s.setActiveBusiness);

  const handleSelect = (businessId: string) => {
    const m = memberships.find((x) => x.businessId === businessId);
    if (!m) return;

    setActiveBusiness(m.businessId, m.businessName ?? null, m.role);
    setActivePersona("BUSINESS");

    if (!canAccessAdminRoute(m.role, pathname)) {
      router.replace(getDefaultAdminRoute(m.role));
    }
  };

  const roleLabel = getBusinessRoleLabel(role);

  const selector = (variant: "pill" | "plain") => (
    <ActiveBusinessSelector
      variant={variant}
      memberships={memberships}
      activeBusinessId={activeBusinessId}
      onSelectBusiness={handleSelect}
    />
  );

  const roleBadge = roleLabel && (
    <span className="rounded-full bg-perola-mint px-2.5 py-0.5 font-accent text-[10px] font-bold uppercase tracking-wider text-perola-deep">
      {roleLabel}
    </span>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      {/* Desktop */}
      <div className="hidden h-16 items-center gap-4 px-4 md:flex">
        <Logo href="/schedule" variant="solid" />
        <span aria-hidden className="h-8 w-px bg-slate-200" />
        {selector("pill")}
        {roleBadge}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={
            sidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"
          }
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" aria-hidden />
          ) : (
            <PanelLeftClose className="h-5 w-5" aria-hidden />
          )}
        </button>

        <div className="ml-auto">
          <ProfileSwitcher variant="admin" />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex h-16 items-center gap-3 px-3 md:hidden">
        <Logo
          href="/schedule"
          variant="solid"
          className="[&>span:last-child]:hidden"
        />
        <div className="flex min-w-0 flex-1 flex-col items-start leading-tight">
          {selector("plain")}
          <div className="-mt-1">{roleBadge}</div>
        </div>
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Abrir menu"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <Menu className="h-6 w-6" aria-hidden />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 overflow-y-auto">
            <SheetHeader className="text-left">
              <SheetTitle>Pérola</SheetTitle>
              <SheetDescription>Painel do salão</SheetDescription>
            </SheetHeader>
            <div className="mt-4 h-[calc(100%-5rem)]">
              <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
