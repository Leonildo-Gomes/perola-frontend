"use client";

import { CalendarCheck, Compass, Flower2, User } from "lucide-react";
import { MobileBottomNav, type BottomNavItem } from "./mobile-bottom-nav";

const ITEMS: BottomNavItem[] = [
  { href: "/", label: "Início", icon: Flower2 },
  { href: "/explore", label: "Explorar", icon: Compass },
  { href: "/my-bookings", label: "Marcações", icon: CalendarCheck },
  { href: "/profile", label: "Perfil", icon: User },
];

export function PublicBottomNav() {
  return <MobileBottomNav items={ITEMS} />;
}
