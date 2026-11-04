"use client";

import { CalendarCheck, Compass, Home, User, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const ITEMS: NavItem[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/explore", label: "Explorar", icon: Compass },
  { href: "/my-bookings", label: "Marcações", icon: CalendarCheck },
  { href: "/profile", label: "Perfil", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 h-16 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto flex h-full max-w-md items-stretch justify-around">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 text-xs font-medium font-accent transition-colors",
                  active ? "text-teal-600" : "text-slate-500 hover:text-slate-900",
                )}
              >
                <Icon className="h-6 w-6" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
