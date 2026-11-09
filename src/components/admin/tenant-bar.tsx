"use client";

import { ChevronDown, LogOut, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/shared/branding";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useLogout } from "@/hooks/use-logout";
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import { ActiveBusinessSelector } from "./active-business-selector";
import { AdminSidebar } from "./admin-sidebar";

interface TenantBarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function TenantBar({ sidebarCollapsed, onToggleSidebar }: TenantBarProps) {
  const logout = useLogout();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const memberships = useAuthStore((s) => s.memberships);
  const activeBusinessId = useTenantStore((s) => s.activeBusinessId);
  const role = useTenantStore((s) => s.userRoleInBusiness);
  const setActiveBusiness = useTenantStore((s) => s.setActiveBusiness);

  const handleSelect = (businessId: string) => {
    const m = memberships.find((x) => x.businessId === businessId);
    if (m) setActiveBusiness(m.businessId, m.businessName ?? null, m.role);
  };

  const roleLabel = role === "OWNER" ? "Proprietário" : role === "EMPLOYEE" ? "Colaborador" : null;
  const initial = user?.name?.trim().charAt(0).toUpperCase() ?? "?";

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
        <Logo href="/dashboard" variant="solid" />
        <span aria-hidden className="h-8 w-px bg-slate-200" />
        {selector("pill")}
        {roleBadge}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
        >
          {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" aria-hidden /> : <PanelLeftClose className="h-5 w-5" aria-hidden />}
        </button>

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Menu do utilizador"
                className="flex min-h-[44px] items-center gap-3 rounded-xl px-2 text-left hover:bg-slate-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-perola-deep text-sm font-bold text-white">
                  {initial}
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                  {roleLabel && <span className="text-xs text-slate-500">{roleLabel}</span>}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate font-normal text-slate-500">{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="min-h-[44px] text-rose-600 focus:text-rose-700" onSelect={logout}>
                <LogOut className="mr-2 h-4 w-4" aria-hidden />
                Terminar sessão
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex h-16 items-center gap-3 px-3 md:hidden">
        <Logo href="/dashboard" variant="solid" className="[&>span:last-child]:hidden" />
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
