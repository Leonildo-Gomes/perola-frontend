"use client";

import { CalendarDays, CalendarRange, Scissors, Store, Users } from "lucide-react";
import {
  MobileBottomNav,
  type BottomNavItem,
} from "@/components/shared/navigation";
import type { BusinessRole } from "@/features/auth/types/auth.types";
import { useTenantStore } from "@/stores/tenant-store";

interface AdminBottomNavItem extends BottomNavItem {
  allowedRoles: readonly BusinessRole[];
}

const ITEMS: AdminBottomNavItem[] = [
  {
    href: "/schedule",
    label: "Agenda",
    icon: CalendarDays,
    allowedRoles: ["OWNER", "EMPLOYEE"],
  },
  {
    href: "/services",
    label: "Serviços",
    icon: Scissors,
    allowedRoles: ["OWNER"],
  },
  {
    href: "/employee",
    label: "Equipa",
    icon: Users,
    allowedRoles: ["OWNER"],
  },
  {
    href: "/availability",
    label: "Horários",
    icon: CalendarRange,
    allowedRoles: ["EMPLOYEE"],
  },
  {
    href: "/settings",
    label: "Salão",
    icon: Store,
    allowedRoles: ["OWNER"],
  },
];

export function AdminBottomNav() {
  const role = useTenantStore((s) => s.userRoleInBusiness);
  const visibleItems = ITEMS.filter(
    (item) => role !== null && item.allowedRoles.includes(role),
  );

  return (
    <MobileBottomNav
      items={visibleItems}
      label="Navegação do painel"
      exactRoots={[]}
    />
  );
}
