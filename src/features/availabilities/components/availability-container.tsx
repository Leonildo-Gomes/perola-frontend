"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  User,
  AlertTriangle,
  RefreshCw,
  Palmtree,
  CalendarCheck,
  Info,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import {
  useHolidays,
  useMonthlySchedules,
  useWeeklySchedules,
} from "../hooks/use-availabilities";
import {
  useOpenMonthlySchedule,
  useSaveWeeklySchedule,
} from "../hooks/use-availability-mutations";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { OpenMonthRequest, ScheduleDay } from "../types/availability.types";
import { MonthlyScheduleCard } from "./monthly-schedule-card";
import { OpenMonthModal } from "./open-month-modal";
import { WeeklyScheduleForm } from "./weekly-schedule-form";
import { TimeOffTab } from "./time-off-tab";

export function AvailabilityContainer() {
  const user = useAuthStore((s) => s.user);
  const memberships = useAuthStore((s) => s.memberships);
  const activeTenantId = useTenantStore((s) => s.activeBusinessId);

  const businessId = activeTenantId || memberships[0]?.businessId || "";

  // Active Tab: "monthly" | "weekly" | "time-off"
  const [activeTab, setActiveTab] = useState<string>("monthly");

  // Selected Employee ID
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  // Modal State for opening a specific month
  const [modalMonth, setModalMonth] = useState<{ year: number; month: number } | null>(null);

  // 1. Fetch Salon Team Employees
  const {
    data: employees = [],
    isLoading: isLoadingEmployees,
    isError: isEmployeesError,
    refetch: refetchEmployees,
  } = useEmployees(businessId);

  // Effective Employee ID to view/manage
  const effectiveEmployeeId = useMemo(() => {
    if (selectedEmployeeId) return selectedEmployeeId;
    if (employees.length > 0) {
      // Find employee associated with logged-in user or take first
      const matched = employees.find((e) => e.userId === user?.id) || employees[0];
      return matched.id;
    }
    return user?.id || "";
  }, [selectedEmployeeId, employees, user?.id]);

  const activeEmployee = employees.find((e) => e.id === effectiveEmployeeId);

  // Calculate the 4 relevant months (Current month + next 3 months)
  const relevantMonths = useMemo(() => {
    const today = new Date();
    const months = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1, // 1-12
        isCurrent: i === 0,
      });
    }
    return months;
  }, []);

  // 2. Fetch Monthly Schedules for selected employee
  const {
    data: monthlySchedules = [],
    isLoading: isLoadingMonthly,
    isError: isMonthlyError,
    refetch: refetchMonthly,
  } = useMonthlySchedules(effectiveEmployeeId);

  console.log("monthlySchedules", monthlySchedules);

  // 3. Fetch Cape Verde Holidays for this year and next year
  const currentYear = new Date().getFullYear();
  const { data: holidays = [], isLoading: isLoadingHolidays } = useHolidays(currentYear);

  // 4. Fetch Weekly Schedules for selected employee
  const {
    data: weeklySchedules = [],
    isLoading: isLoadingWeekly,
    isError: isWeeklyError,
    refetch: refetchWeekly,
  } = useWeeklySchedules(effectiveEmployeeId);

  const activeWeeklySchedule = weeklySchedules[0] || null;

  // 5. Open Monthly Schedule Mutation
  const openMonthMutation = useOpenMonthlySchedule(effectiveEmployeeId);

  // 6. Save Weekly Schedule Mutation
  const saveWeeklyMutation = useSaveWeeklySchedule(
    effectiveEmployeeId,
    activeWeeklySchedule?.id,
  );

  const handleOpenMonthConfirm = async (payload: OpenMonthRequest) => {
    await openMonthMutation.mutateAsync(payload);
    setModalMonth(null);
  };

  const handleWeeklySave = async (payload: {
    name: string;
    isDefault: boolean;
    days: ScheduleDay[];
  }) => {
    await saveWeeklyMutation.mutateAsync(payload);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
              <CalendarCheck className="w-5 h-5 text-teal-600" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Gestão de Disponibilidade
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Controle a abertura mandatória de meses, turnos de atendimento, pausas e bloqueios de feriados.
          </p>
        </div>

        {/* Employee Selector (Specialist Filter) */}
        {employees.length > 1 && (
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-2xs">
            <User className="w-4 h-4 text-slate-400 ml-2" />
            <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
              Profissional:
            </span>
            <Select
              value={effectiveEmployeeId}
              onValueChange={setSelectedEmployeeId}
            >
              <SelectTrigger className="border-0 shadow-none focus:ring-0 min-w-[170px] font-semibold text-slate-900 text-xs sm:text-sm">
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id} className="text-xs sm:text-sm">
                    {emp.displayName} {emp.isOwner ? "(Dono)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Segmented Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-2xl border border-slate-200/60 max-w-md w-full grid grid-cols-3">
          <TabsTrigger
            value="monthly"
            className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-xs min-h-[40px]"
          >
            <Calendar className="w-4 h-4 mr-1.5" />
            Abertura Mensal
          </TabsTrigger>
          <TabsTrigger
            value="weekly"
            className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-xs min-h-[40px]"
          >
            <Clock className="w-4 h-4 mr-1.5" />
            Expediente Semanal
          </TabsTrigger>
          <TabsTrigger
            value="time-off"
            className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-xs min-h-[40px]"
          >
            <Palmtree className="w-4 h-4 mr-1.5" />
            Ausências
          </TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: Abertura Mensal (Screen 8 / Par 7) */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="monthly" className="space-y-6 mt-0">
          {/* Informational Callout */}
          <div className="bg-gradient-to-r from-teal-50/80 via-emerald-50/40 to-white border border-teal-100/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Regra de Abertura Mandatória Pérola
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Os clientes só conseguem marcar horários nos meses que tiverem a agenda expressamente aberta.
                  Cada abertura detecta automaticamente os feriados oficiais de Cabo Verde para definir folgas preventivas.
                </p>
              </div>
            </div>
            {activeEmployee && (
              <div className="text-right shrink-0">
                <span className="text-[11px] font-medium text-slate-500">A gerir agenda de:</span>
                <div className="text-xs sm:text-sm font-bold text-teal-900">
                  {activeEmployee.displayName}
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoadingMonthly && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 border rounded-2xl bg-white space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-36 rounded-md" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isMonthlyError && !isLoadingMonthly && (
            <div className="p-8 border border-rose-200 bg-rose-50/50 rounded-2xl text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
              <h3 className="text-sm font-bold text-rose-900">
                Não foi possível carregar o estado dos meses
              </h3>
              <p className="text-xs text-rose-700 max-w-md mx-auto">
                Houve uma falha ao comunicar com o servidor de disponibilidade.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchMonthly()}
                className="rounded-xl border-rose-200 text-rose-800 hover:bg-rose-100"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Tentar Novamente
              </Button>
            </div>
          )}

          {/* Ideal State: 4 Months Grid */}
          {!isLoadingMonthly && !isMonthlyError && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {relevantMonths.map((m) => {
                const schedule = monthlySchedules.find(
                  (s) => s.year === m.year && s.month === m.month,
                );

                return (
                  <MonthlyScheduleCard
                    key={`${m.year}-${m.month}`}
                    year={m.year}
                    month={m.month}
                    schedule={schedule}
                    holidays={holidays}
                    isCurrentMonth={m.isCurrent}
                    onOpenClick={() => setModalMonth({ year: m.year, month: m.month })}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: Expediente Semanal (Screen 9 / Par 8) */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="weekly" className="mt-0 space-y-6">
          {isLoadingWeekly ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="p-5 border rounded-2xl bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-xl" />
                    <Skeleton className="w-32 h-5 rounded" />
                  </div>
                  <Skeleton className="w-48 h-9 rounded-xl" />
                </div>
              ))}
            </div>
          ) : isWeeklyError ? (
            <div className="p-8 border border-rose-200 bg-rose-50/50 rounded-2xl text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
              <h3 className="text-sm font-bold text-rose-900">
                Erro ao carregar expediente semanal
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchWeekly()}
                className="rounded-xl border-rose-200 text-rose-800"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Recarregar
              </Button>
            </div>
          ) : (
            <WeeklyScheduleForm
              initialSchedule={activeWeeklySchedule}
              onSave={handleWeeklySave}
              isSaving={saveWeeklyMutation.isPending}
            />
          )}
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: Ausências & Férias (Screen 10 / Par 9 / FE-014) */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="time-off" className="mt-0">
          <TimeOffTab
            employeeId={effectiveEmployeeId}
            employeeName={activeEmployee?.displayName}
          />
        </TabsContent>
      </Tabs>

      {/* Open Month Modal Dialog */}
      {modalMonth && (
        <OpenMonthModal
          isOpen={Boolean(modalMonth)}
          onClose={() => setModalMonth(null)}
          year={modalMonth.year}
          month={modalMonth.month}
          holidays={holidays}
          weeklySchedules={weeklySchedules}
          onConfirm={handleOpenMonthConfirm}
          isSubmitting={openMonthMutation.isPending}
        />
      )}
    </div>
  );
}

