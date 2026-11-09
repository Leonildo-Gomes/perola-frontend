"use client";

import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarCheck,
  CalendarPlus,
  Compass,
  Headphones,
  Info,
  Lock,
  MessageCircle,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppointmentCard } from "./appointment-card";
import { CancelModal } from "./cancel-modal";
import { RescheduleModal } from "./reschedule-modal";
import { ReviewModal } from "./review-modal";
import { EmptyState } from "@/components/shared/feedback";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useMyBookings } from "../hooks/use-my-bookings";
import { formatInstantLong, formatTime } from "@/lib/utils/datetime";
import { formatCurrency } from "@/lib/utils/utils";
import { useAuthStore } from "@/stores/auth-store";
import type { CustomerAppointment } from "../types/customer.types";

type TabType = "upcoming" | "history";

export function MyBookingsContainer() {
  const hydrated = useAuthHydrated();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [rescheduleTarget, setRescheduleTarget] = useState<CustomerAppointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CustomerAppointment | null>(null);
  const [reviewTarget, setReviewTarget] = useState<CustomerAppointment | null>(null);

  const appointmentsQuery = useMyBookings(undefined, hydrated && isAuthenticated);

  const appointments = useMemo(() => {
    return appointmentsQuery.data ?? [];
  }, [appointmentsQuery.data]);

  // Categorize
  const upcomingList = useMemo(() => {
    return appointments.filter(
      (a) => a.status === "PENDING" || a.status === "CONFIRMED" || a.status === "RESCHEDULE_PENDING",
    );
  }, [appointments]);

  const historyList = useMemo(() => {
    return appointments.filter(
      (a) => a.status === "COMPLETED" || a.status === "CANCELLED",
    );
  }, [appointments]);

  // Earliest upcoming within 48h for the spotlight reminder banner
  const nextUpcoming = useMemo(() => {
    if (upcomingList.length === 0) return null;
    const sorted = [...upcomingList].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
    return sorted[0];
  }, [upcomingList]);

  // Filter by search
  const currentTabList = activeTab === "upcoming" ? upcomingList : historyList;
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return currentTabList;
    const q = searchQuery.toLowerCase();
    return currentTabList.filter(
      (a) =>
        a.serviceName.toLowerCase().includes(q) ||
        (a.businessName && a.businessName.toLowerCase().includes(q)) ||
        (a.employeeName && a.employeeName.toLowerCase().includes(q)),
    );
  }, [currentTabList, searchQuery]);

  // Personal statistics
  const totalInvested = useMemo(() => {
    return appointments
      .filter((a) => a.status === "COMPLETED")
      .reduce((acc, curr) => acc + (curr.servicePrice || 0), 0);
  }, [appointments]);

  const uniqueSalonsCount = useMemo(() => {
    const ids = new Set(appointments.map((a) => a.businessId));
    return ids.size;
  }, [appointments]);

  // Auth Guard
  if (hydrated && !isAuthenticated) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-perola-mint text-perola-deep">
          <Lock className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Minhas Marcações</h1>
        <p className="mt-2 text-sm text-slate-600">
          Inicie sessão na sua conta Pérola para consultar o histórico dos seus agendamentos, reagendar ou avaliar serviços.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row justify-center">
          <Button asChild variant="brand" className="min-h-[44px]">
            <Link href="/login?next=/my-bookings">Iniciar Sessão</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-[44px]">
            <Link href="/explore">Explorar Serviços</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-6 md:py-10">
      {/* Breadcrumb & Header */}
      <div className="mb-6 md:mb-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-perola-deep transition-colors">
            Início
          </Link>
          <span>/</span>
          <span className="font-semibold text-perola-deep">Minhas Marcações</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Minhas Marcações
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Faça a gestão dos seus agendamentos de beleza e bem-estar em Cabo Verde.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="brand" className="rounded-full min-h-[44px]">
              <Link href="/explore">
                <CalendarPlus className="mr-2 h-4 w-4" aria-hidden />
                Novo Agendamento
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Reminder Spotlight Banner (if next upcoming exists) */}
      {nextUpcoming && (
        <section
          className="mb-8 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-perola-mint/70 via-white to-perola-mint/30 border border-perola-deep/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          aria-label="Lembrete de próximo agendamento"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-perola-deep text-white shadow-sm">
              <Bell className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-perola-deep px-2 py-0.5 text-[10px] font-extrabold text-white tracking-wide uppercase">
                  Lembrete
                </span>
                <span className="text-xs text-slate-500 font-medium">Próximo atendimento</span>
              </div>
              <p className="text-sm md:text-base font-bold text-slate-900 mt-0.5">
                {nextUpcoming.serviceName} no {nextUpcoming.businessName}
              </p>
              <p className="text-xs text-slate-600 capitalize">
                {formatInstantLong(nextUpcoming.startTime)} às {formatTime(nextUpcoming.startTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveTab("upcoming");
                window.scrollTo({ top: 250, behavior: "smooth" });
              }}
              className="rounded-full text-xs font-semibold text-perola-deep border-perola-deep/40 hover:bg-perola-mint/50"
            >
              Ver Detalhes
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </Button>
          </div>
        </section>
      )}

      {/* Filter & Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
        {/* Segmented Tabs */}
        <div className="inline-flex rounded-full bg-slate-100 p-1 border border-slate-200" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "upcoming"}
            onClick={() => setActiveTab("upcoming")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs md:text-sm font-bold transition-all min-h-[38px] ${activeTab === "upcoming"
              ? "bg-perola-deep text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <span>Próximas</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${activeTab === "upcoming" ? "bg-perola-mint text-perola-deep" : "bg-slate-200 text-slate-700"
                }`}
            >
              {upcomingList.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs md:text-sm font-bold transition-all min-h-[38px] ${activeTab === "history"
              ? "bg-perola-deep text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <span>Histórico & Concluídos</span>
            <span className="text-[11px] opacity-75">({historyList.length})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" aria-hidden />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por salão ou serviço..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:border-perola-deep focus:outline-none focus:ring-2 focus:ring-perola-deep/20"
          />
        </div>
      </div>

      {/* Main Two-Column Layout (List + Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Bookings Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {appointmentsQuery.isLoading ? (
            <div className="space-y-4" aria-busy="true" aria-label="A carregar marcações">
              <Skeleton className="h-44 w-full rounded-2xl" />
              <Skeleton className="h-44 w-full rounded-2xl" />
            </div>
          ) : appointmentsQuery.isError ? (
            <EmptyState
              icon={AlertTriangle}
              tone="error"
              title="Não foi possível carregar as marcações"
              description="Ocorreu um erro ao comunicar com os serviços Pérola. Verifique a sua ligação."
            >
              <Button
                type="button"
                variant="brand"
                onClick={() => void appointmentsQuery.refetch()}
              >
                Tentar novamente
              </Button>
            </EmptyState>
          ) : filteredList.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title={
                activeTab === "upcoming"
                  ? "Não tem marcações agendadas"
                  : "Nenhum histórico encontrado"
              }
              description={
                searchQuery
                  ? "Nenhum agendamento corresponde ao filtro de pesquisa."
                  : activeTab === "upcoming"
                    ? "Ainda não tem cuidados marcados para os próximos dias. Encontre os melhores profissionais de beleza em Cabo Verde!"
                    : "As suas marcações concluídas ou canceladas aparecerão aqui."
              }
            >
              <Button asChild variant="brand" className="rounded-full">
                <Link href="/explore">
                  <Compass className="mr-2 h-4 w-4" aria-hidden />
                  Explorar Salões & Serviços
                </Link>
              </Button>
            </EmptyState>
          ) : (
            filteredList.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onReschedule={(apt) => setRescheduleTarget(apt)}
                onCancel={(apt) => setCancelTarget(apt)}
                onReview={(apt) => setReviewTarget(apt)}
              />
            ))
          )}
        </div>

        {/* Secondary Column: Sidebar Widgets (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Mini Stats Widget */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-3.5 flex items-center justify-between">
              <span>Resumo Pessoal</span>
              <TrendingUp className="h-4 w-4 text-perola-deep" aria-hidden />
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Marcações
                </span>
                <p className="text-xl font-extrabold text-perola-deep mt-0.5">
                  {appointments.length}
                </p>
                <p className="text-[11px] text-slate-500">Agendamentos totais</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Salões
                </span>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {uniqueSalonsCount}
                </p>
                <p className="text-[11px] text-slate-500">Espaços visitados</p>
              </div>
            </div>
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">Total investido em bem-estar:</span>
              <span className="font-extrabold font-accent text-slate-900">
                {formatCurrency(totalInvested)}
              </span>
            </div>
          </div>

          {/* Concierge Pérola Direct WhatsApp Support */}
          <div className="rounded-2xl border border-perola-deep/20 bg-gradient-to-br from-white to-perola-mint/30 p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-perola-deep text-white shadow-sm">
                <Headphones className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Concierge Pérola
                </h3>
                <span className="text-[11px] font-semibold text-perola-deep">
                  Suporte Local • Cabo Verde
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Dúvidas sobre reagendamentos, localização ou cancelamentos? A nossa equipa de apoio ao cliente está disponível no WhatsApp.
            </p>
            <a
              href="https://wa.me/2380000000?text=Ol%C3%A1%21+Preciso+de+ajuda+com+as+minhas+marca%C3%A7%C3%B5es+na+P%C3%A9rola."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-perola-deep hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Falar pelo WhatsApp (+238)
            </a>
            <p className="text-center text-[10px] text-slate-400 mt-2">
              Segunda a Sábado • 08:00 às 20:00 (CV Time)
            </p>
          </div>

          {/* Discovery Promo Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-amber-600">
              <Sparkles className="h-4 w-4 fill-amber-500" aria-hidden />
              <span className="text-xs font-bold uppercase tracking-wider">
                Novos Cuidados
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Precisa de mais um momento de relaxamento?
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
              Explore cabeleireiros, manicures, massagens e barbearias recomendadas nas ilhas de Santiago, São Vicente e Sal.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full rounded-full text-xs font-bold">
              <Link href="/explore">
                Explorar Novos Serviços
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
              </Link>
            </Button>
          </div>

          {/* Friendly Policy Note */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-perola-deep shrink-0 mt-0.5" aria-hidden />
            <p>
              <strong>Cancelamentos sem encargos:</strong> Pode cancelar ou solicitar reagendamento de qualquer marcação até 2 horas antes do atendimento agendado.
            </p>
          </div>
        </aside>
      </div>

      {/* Interactive Modals */}

      <RescheduleModal
        appointment={rescheduleTarget}
        isOpen={Boolean(rescheduleTarget)}
        onClose={() => setRescheduleTarget(null)}
      />
      <CancelModal
        appointment={cancelTarget}
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
      />

      <ReviewModal
        appointment={reviewTarget}
        isOpen={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
      />
    </div>
  );
}

