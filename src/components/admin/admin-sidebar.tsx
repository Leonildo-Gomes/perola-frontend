"use client";

import { Flower2, LifeBuoy, LogOut, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-logout";
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import { AdminNav } from "./admin-nav";

const SUPPORT_WHATSAPP = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP; // e.g. 2389912345

interface AdminSidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function AdminSidebar({ collapsed = false, onNavigate }: AdminSidebarProps) {
  const logout = useLogout();
  const memberships = useAuthStore((s) => s.memberships);
  const activeId = useTenantStore((s) => s.activeBusinessId);
  const businessName = memberships.find((m) => m.businessId === activeId)?.businessName ?? "O meu salão";

  return (
    <div className="flex h-full flex-col gap-4">
      {!collapsed && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-perola-mint text-perola-deep">
            <Flower2 className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 truncate text-sm font-bold text-slate-900">{businessName}</span>
        </div>
      )}

      <Button asChild variant="brand" className={collapsed ? "px-0" : "w-full rounded-xl"}>
        <Link href="/schedule?new=1" onClick={onNavigate} aria-label="Novo Agendamento">
          <Plus className={collapsed ? "h-5 w-5" : "mr-2 h-5 w-5"} aria-hidden />
          {!collapsed && "Novo Agendamento"}
        </Link>
      </Button>

      <AdminNav collapsed={collapsed} onNavigate={onNavigate} />

      <div className="mt-auto flex flex-col gap-1 border-t border-slate-200 pt-4">
        {!collapsed && SUPPORT_WHATSAPP && (
          <a
            href={`https://wa.me/${SUPPORT_WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className="mb-2 flex min-h-[44px] items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold text-perola-deep"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            <span className="flex flex-col leading-tight">
              <span className="font-accent text-[10px] uppercase tracking-[0.14em] text-slate-500">Suporte local CV</span>
              +238 WhatsApp Direto
            </span>
          </a>
        )}
        {!collapsed && (
          <span className="flex min-h-[44px] items-center gap-3 px-3.5 text-sm text-slate-500">
            <LifeBuoy className="h-5 w-5" aria-hidden />
            Suporte Técnico
          </span>
        )}
        <button
          type="button"
          onClick={logout}
          aria-label="Terminar sessão"
          className="flex min-h-[48px] items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden />
          {!collapsed && "Terminar Sessão"}
        </button>
      </div>
    </div>
  );
}
