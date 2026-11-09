"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { addDaysToKey, cvDateKey, formatDateHeader } from "@/lib/datetime";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import type { SalonAppointment } from "../types/schedule.types";
import { useSalonAppointments } from "../hooks/use-schedules";
import {
  useAcceptReschedule,
  useCancelSalonAppointment,
  useCompleteAppointment,
  useConfirmAppointment,
  useCreateSalonAppointment,
  useRejectReschedule,
} from "../hooks/use-schedule-mutations";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { useServices } from "@/features/services/hooks/use-services";
import { NewAppointmentModal } from "./new-appointment-modal";
import { ScheduleTimeline } from "./schedule-timeline";

type ViewMode = "DAY" | "WEEK" | "MONTH";

export function ScheduleContainer() {
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const memberships = useAuthStore((s) => s.memberships);
  const activeTenantId = useTenantStore((s) => s.activeBusinessId);

  const businessId = activeTenantId || memberships[0]?.businessId || "";

  // Date state (defaults to today in Cape Verde time)
  const [dateKey, setDateKey] = useState<string>(() => cvDateKey());
  const [viewMode, setViewMode] = useState<ViewMode>("DAY");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("ALL");

  // Modal states
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<SalonAppointment | null>(null);

  // Auto-open modal if navigated from sidebar "+ Novo Agendamento" (?new=1)
  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setIsNewModalOpen(true);
    }
  }, [searchParams]);

  // Date Navigation handlers
  const handlePrevDay = () => setDateKey((prev) => addDaysToKey(prev, -1));
  const handleNextDay = () => setDateKey((prev) => addDaysToKey(prev, 1));
  const handleToday = () => setDateKey(cvDateKey());

  // Queries
  const appointmentsQuery = useSalonAppointments(businessId, {
    date: dateKey,
    employeeId: selectedEmployeeId !== "ALL" ? selectedEmployeeId : undefined,
  });

  const employeesQuery = useEmployees(businessId);
  const servicesQuery = useServices(businessId);

  const appointments = useMemo(() => appointmentsQuery.data ?? [], [appointmentsQuery.data]);
  const employees = useMemo(() => employeesQuery.data ?? [], [employeesQuery.data]);
  const services = useMemo(() => servicesQuery.data ?? [], [servicesQuery.data]);

  // Daily statistics
  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter((a) => a.status === "PENDING").length;
    const confirmed = appointments.filter((a) => a.status === "CONFIRMED").length;
    const completed = appointments.filter((a) => a.status === "COMPLETED").length;
    const expectedRevenue = appointments.reduce((sum, a) => {
      return a.status !== "CANCELLED" ? sum + Number(a.servicePrice) : sum;
    }, 0);

    return { total, pending, confirmed, completed, expectedRevenue };
  }, [appointments]);

  // Filtered appointments by search term
  const filteredAppointments = useMemo(() => {
    if (!searchQuery.trim()) return appointments;
    const q = searchQuery.toLowerCase();
    return appointments.filter(
      (a) =>
        a.customerName?.toLowerCase().includes(q) ||
        a.customerPhone?.includes(q) ||
        a.serviceName.toLowerCase().includes(q) ||
        a.employeeName?.toLowerCase().includes(q),
    );
  }, [appointments, searchQuery]);

  // Mutations
  const confirmMutation = useConfirmAppointment(businessId);
  const completeMutation = useCompleteAppointment(businessId);
  const cancelMutation = useCancelSalonAppointment(businessId);
  const acceptRescheduleMutation = useAcceptReschedule(businessId);
  const rejectRescheduleMutation = useRejectReschedule(businessId);
  const createAppointmentMutation = useCreateSalonAppointment(businessId);

  // Action handlers
  const handleConfirmAppointment = (appointment: SalonAppointment) => {
    confirmMutation.mutate(appointment.id);
  };

  const handleCompleteAppointment = (appointment: SalonAppointment) => {
    completeMutation.mutate(appointment.id);
  };

  const handleCancelAppointment = (appointment: SalonAppointment) => {
    setAppointmentToCancel(appointment);
  };

  const handleConfirmCancel = () => {
    if (appointmentToCancel) {
      cancelMutation.mutate(appointmentToCancel.id);
      setAppointmentToCancel(null);
    }
  };

  const handleAcceptReschedule = (appointment: SalonAppointment) => {
    acceptRescheduleMutation.mutate(appointment.id);
  };

  const handleRejectReschedule = (appointment: SalonAppointment) => {
    rejectRescheduleMutation.mutate(appointment.id);
  };

  const handleCreateAppointment = async (data: {
    customerName: string;
    customerPhone: string;
    employeeId: string;
    serviceId: string;
    startTime: string;
    notes?: string;
  }) => {
    await createAppointmentMutation.mutateAsync(data);
  };

  const isPendingAction =
    confirmMutation.isPending ||
    completeMutation.isPending ||
    cancelMutation.isPending ||
    acceptRescheduleMutation.isPending ||
    rejectRescheduleMutation.isPending;

  // 1. Loading State
  if (appointmentsQuery.isLoading || employeesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  // 2. Error State
  if (appointmentsQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-rose-500 mb-3" />
        <h3 className="text-base font-bold text-rose-900">
          Não foi possível carregar a agenda
        </h3>
        <p className="mt-1 max-w-md text-xs text-rose-700">
          Ocorreu um erro ao comunicar com o servidor da agenda. Verifique a sua ligação à internet.
        </p>
        <Button
          variant="outline"
          onClick={() => appointmentsQuery.refetch()}
          className="mt-4 rounded-xl border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ========================================================================= */}
      {/* TOP HEADER CONTROLS (Title, Date Switcher, Stats & CTA)                  */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title & Live Timezone Indicator */}
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Agenda Operacional
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                Tempo Real
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {formatDateHeader(dateKey)} • Fuso horário CVT (Praia, UTC-1)
            </p>
          </div>

          {/* Date Switcher Cluster & View Mode */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Switcher */}
            <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-1 shadow-xs">
              <button
                type="button"
                onClick={handlePrevDay}
                className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-white transition-colors"
                title="Dia anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="px-3 text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-teal-600" />
                <span>{formatDateHeader(dateKey)}</span>
              </div>
              <button
                type="button"
                onClick={handleNextDay}
                className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-white transition-colors"
                title="Próximo dia"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="ml-1 px-2.5 py-1 text-xs bg-white hover:bg-slate-100 rounded-lg text-teal-700 font-semibold border border-slate-200 transition-colors"
              >
                Hoje
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode("DAY")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "DAY"
                    ? "bg-teal-600 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Dia
              </button>
              <button
                type="button"
                onClick={() => setViewMode("WEEK")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "WEEK"
                    ? "bg-teal-600 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semana
              </button>
              <button
                type="button"
                onClick={() => setViewMode("MONTH")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "MONTH"
                    ? "bg-teal-600 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Mês
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Control Bar: Search Filter, Stats Chips & Primary CTA */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Search Input */}
          <div className="relative w-full xl:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por cliente, serviço ou telefone..."
              className="pl-9 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs"
            />
          </div>

          {/* Stats Chips and CTA Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Total Agendados */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <Clock className="h-4 w-4 text-teal-600" />
              <span className="font-bold text-teal-700">{stats.total}</span>
              <span className="text-slate-500">Agendados</span>
            </div>

            {/* Pendentes */}
            {stats.pending > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-bold">{stats.pending}</span>
                <span>Pendente{stats.pending > 1 ? "s" : ""}</span>
              </div>
            )}

            {/* Faturação Prevista */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 font-semibold">
              <DollarSign className="h-4 w-4 text-teal-700" />
              <span className="text-slate-500">Faturação:</span>
              <span className="font-bold font-price text-teal-800">
                {formatCurrency(stats.expectedRevenue)}
              </span>
            </div>

            {/* Primary CTA Button */}
            <Button
              type="button"
              variant="brand"
              onClick={() => setIsNewModalOpen(true)}
              className="rounded-xl shadow-xs min-h-[40px] px-4 font-semibold text-xs"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>
        </div>
      </section>

      {/* Staff Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedEmployeeId("ALL")}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
            selectedEmployeeId === "ALL"
              ? "bg-teal-600 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Todos os Profissionais ({employees.length})
        </button>

        {employees.map((emp) => {
          const isSelected = selectedEmployeeId === emp.id;
          return (
            <button
              key={emp.id}
              type="button"
              onClick={() => setSelectedEmployeeId(emp.id)}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-2 transition-colors ${
                isSelected
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span
                className={`flex h-5 w-5 rounded-full items-center justify-center text-[10px] font-bold ${
                  isSelected ? "bg-white text-teal-700" : "bg-teal-100 text-teal-800"
                }`}
              >
                {emp.displayName.slice(0, 2).toUpperCase()}
              </span>
              <span>{emp.displayName}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TIMELINE VIEW                                                            */}
      {/* ========================================================================= */}
      <ScheduleTimeline
        dateKey={dateKey}
        appointments={filteredAppointments}
        employees={employees}
        selectedEmployeeId={selectedEmployeeId}
        onConfirmAppointment={handleConfirmAppointment}
        onCompleteAppointment={handleCompleteAppointment}
        onCancelAppointment={handleCancelAppointment}
        onAcceptReschedule={handleAcceptReschedule}
        onRejectReschedule={handleRejectReschedule}
        isPendingAction={isPendingAction}
      />

      {/* ========================================================================= */}
      {/* MODAL: NOVO AGENDAMENTO                                                  */}
      {/* ========================================================================= */}
      <NewAppointmentModal
        open={isNewModalOpen}
        onOpenChange={setIsNewModalOpen}
        dateKey={dateKey}
        employees={employees}
        services={services}
        onSubmit={handleCreateAppointment}
      />

      {/* ========================================================================= */}
      {/* MODAL: CONFIRMAR CANCELAMENTO                                            */}
      {/* ========================================================================= */}
      <Dialog
        open={Boolean(appointmentToCancel)}
        onOpenChange={(open) => !open && setAppointmentToCancel(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <DialogTitle className="text-lg">Cancelar Agendamento</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500 pt-1">
              Tem a certeza de que deseja cancelar a marcação de{" "}
              <strong className="text-slate-800">
                {appointmentToCancel?.customerName}
              </strong>{" "}
              para {appointmentToCancel?.serviceName}? Esta ação liberta o horário para outros clientes.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={cancelMutation.isPending}
              onClick={() => setAppointmentToCancel(null)}
              className="rounded-xl"
            >
              Voltar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={cancelMutation.isPending}
              onClick={handleConfirmCancel}
              className="rounded-xl min-w-[100px]"
            >
              {cancelMutation.isPending ? "A cancelar..." : "Sim, Cancelar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

