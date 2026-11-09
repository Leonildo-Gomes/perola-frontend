"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface BottomNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface MobileBottomNavProps {
  items: BottomNavItem[];
  label?: string;
  /** Match only the exact path for "/" style roots. */
  exactRoots?: string[];
  className?: string;
}

/** 64px fixed bottom bar; active item gets the mint pill from the Stitch designs. */
export function MobileBottomNav({ items, label = "Navegação principal", exactRoots = ["/"], className }: MobileBottomNavProps) {
  const pathname = usePathname();
  return (
    <nav
      aria-label={label}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 h-16 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden",
        className,
      )}
    >
      <ul className="mx-auto flex h-full max-w-md items-stretch justify-around">
        {items.map(({ href, label: text, icon: Icon }) => {
          const active = exactRoots.includes(href) ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 text-xs font-semibold",
                  active ? "text-perola-deep" : "text-slate-500 hover:text-slate-900",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-12 items-center justify-center rounded-full transition-colors",
                    active && "bg-perola-mint",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                {text}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
