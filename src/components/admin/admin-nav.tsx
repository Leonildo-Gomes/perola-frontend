"use client";

import {
  CalendarDays,
  CalendarRange,
  LayoutDashboard,
  Scissors,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BusinessRole } from "@/features/auth/types/auth.types";
import { cn } from "@/lib/utils/utils";
import { useTenantStore } from "@/stores/tenant-store";

interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  allowedRoles: readonly BusinessRole[];
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["OWNER"],
  },
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
    label: "Disponibilidade",
    icon: CalendarRange,
    allowedRoles: ["OWNER", "EMPLOYEE"],
  },
  {
    href: "/settings",
    label: "Definições",
    icon: Settings,
    allowedRoles: ["OWNER"],
  },
];

interface AdminNavProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function AdminNav({ collapsed = false, onNavigate }: AdminNavProps) {
  const pathname = usePathname();
  const role = useTenantStore((s) => s.userRoleInBusiness);

  const visibleItems = ADMIN_NAV_ITEMS.filter(
    (item) => role !== null && item.allowedRoles.includes(role),
  );

  return (
    <nav aria-label="Navegação do painel">
      <ul className="flex flex-col gap-1">
        {visibleItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                aria-label={collapsed ? label : undefined}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex min-h-[48px] items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-colors",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-perola-mint text-perola-deep"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                {!collapsed && <span className="flex-1">{label}</span>}
                {!collapsed && active && (
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full bg-perola-deep"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
