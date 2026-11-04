"use client";

import { CalendarDays, Scissors, Store, Users } from "lucide-react";
import { MobileBottomNav, type BottomNavItem } from "@/components/common/mobile-bottom-nav";

const ITEMS: BottomNavItem[] = [
  { href: "/schedule", label: "Agenda", icon: CalendarDays },
  { href: "/services", label: "Serviços", icon: Scissors },
  { href: "/team", label: "Equipa", icon: Users },
  { href: "/settings", label: "Salão", icon: Store },
];

export function AdminBottomNav() {
  return <MobileBottomNav items={ITEMS} label="Navegação do painel" exactRoots={[]} />;
}
