"use client";

import { LogOut, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import { ActiveBusinessSelector } from "./active-business-selector";
import { AdminNav } from "./admin-nav";

interface TenantBarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function TenantBar({ sidebarCollapsed, onToggleSidebar }: TenantBarProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const memberships = useAuthStore((s) => s.memberships);
  const logout = useAuthStore((s) => s.logout);
  const activeBusinessId = useTenantStore((s) => s.activeBusinessId);
  const setActiveBusiness = useTenantStore((s) => s.setActiveBusiness);

  const handleSelect = (businessId: string) => {
    const m = memberships.find((x) => x.businessId === businessId);
    if (m) setActiveBusiness(m.businessId, m.businessName ?? null, m.role);
  };

  const initial = user?.name?.trim().charAt(0).toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-slate-200 bg-white px-3 md:px-4">
      {/* Mobile drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu">
            <Menu className="h-5 w-5" aria-hidden />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetHeader className="text-left">
            <SheetTitle>Pérola</SheetTitle>
            <SheetDescription>Painel do salão</SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <AdminNav onNavigate={() => setDrawerOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <Logo href="/dashboard" className="hidden md:inline-flex" />
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:inline-flex"
        onClick={onToggleSidebar}
        aria-label={sidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
      >
        {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" aria-hidden /> : <PanelLeftClose className="h-5 w-5" aria-hidden />}
      </Button>

      <ActiveBusinessSelector
        memberships={memberships}
        activeBusinessId={activeBusinessId}
        onSelectBusiness={handleSelect}
      />

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1 font-accent text-xs font-medium text-teal-700 sm:inline-flex">
          <span aria-hidden className="h-2 w-2 rounded-full bg-emerald-500" />
          CV (+238)
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Menu do utilizador">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
                {initial}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span className="truncate">{user?.name}</span>
              <span className="truncate text-xs font-normal text-slate-500">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="min-h-[44px] text-rose-600 focus:text-rose-700"
              onSelect={() => {
                logout();
                router.replace("/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" aria-hidden />
              Terminar sessão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
