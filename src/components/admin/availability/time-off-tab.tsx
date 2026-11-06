"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Palmtree,
  Plus,
  RefreshCw,
  AlertTriangle,
  Calendar,
  Filter,
  CheckCircle2,
  CalendarOff,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  getTimeOffList,
  createTimeOff,
  deleteTimeOff,
} from "@/lib/api/availability";
import type {
  CreateTimeOffPayload,
  EmployeeTimeOff,
} from "@/types/availability";
import { TimeOffCard } from "./time-off-card";
import { TimeOffFormModal } from "./time-off-form-modal";

interface TimeOffTabProps {
  employeeId: string;
  employeeName?: string;
}

type FilterMode = "UPCOMING" | "PAST" | "ALL";

export function TimeOffTab({ employeeId, employeeName }: TimeOffTabProps) {
  const queryClient = useQueryClient();
  const [filterMode, setFilterMode] = useState<FilterMode>("UPCOMING");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 1. Fetch Time-Off list
  const {
    data: timeOffList = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["time-off", employeeId],
    queryFn: () => getTimeOffList(employeeId),
    enabled: Boolean(employeeId),
    staleTime: 30_000,
  });

  // 2. Create Time-Off Mutation
  const createMutation = useMutation({
    mutationFn: (payload: CreateTimeOffPayload) =>
      createTimeOff(employeeId, payload),
    onSuccess: () => {
      toast.success("Ausência registada com sucesso! Horários bloqueados na agenda.");
      queryClient.invalidateQueries({ queryKey: ["time-off", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error(
        "Não foi possível registar a ausência. Verifique a ligação e tente novamente.",
      );
    },
  });

  // 3. Delete Time-Off Mutation
  const deleteMutation = useMutation({
    mutationFn: (timeOffId: string) => deleteTimeOff(employeeId, timeOffId),
    onSuccess: () => {
      toast.success("Bloqueio de agenda removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["time-off", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
    onError: () => {
      toast.error("Erro ao remover ausência. Tente novamente.");
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDeleteTimeOff = async (id: string) => {
    setDeletingId(id);
    await deleteMutation.mutateAsync(id);
  };

  const handleCreateSubmit = async (payload: CreateTimeOffPayload) => {
    await createMutation.mutateAsync(payload);
  };

  // Filtered List based on date
  const todayStr = new Date().toISOString().split("T")[0];

  const filteredList = useMemo(() => {
    return timeOffList
      .filter((item) => {
        if (filterMode === "UPCOMING") {
          return item.endDate >= todayStr;
        }
        if (filterMode === "PAST") {
          return item.endDate < todayStr;
        }
        return true;
      })
      .sort((a, b) => (a.startDate > b.startDate ? 1 : -1));
  }, [timeOffList, filterMode, todayStr]);

  // Statistics
  const upcomingCount = timeOffList.filter((t) => t.endDate >= todayStr).length;
  const pastCount = timeOffList.filter((t) => t.endDate < todayStr).length;
  const activeToday = timeOffList.some(
    (t) => todayStr >= t.startDate && todayStr <= t.endDate,
  );

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Stats */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Palmtree className="w-5 h-5 text-teal-600" />
              Ausências & Férias do Especialista
            </h3>
            <p className="text-xs text-slate-500">
              {employeeName
                ? `A gerir ausências e períodos de folga de ${employeeName}.`
                : "Registe períodos de férias, atestados ou folgas para prevenir sobreposições."}
            </p>
          </div>

          {/* "+ Registar Ausência" CTA button */}
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all px-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Registar Ausência / Férias
          </Button>
        </div>

        {/* Sub-Filters: Upcoming vs Past vs All */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={filterMode === "UPCOMING" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterMode("UPCOMING")}
              className={`text-xs rounded-xl min-h-[36px] ${
                filterMode === "UPCOMING"
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Próximas & Ativas ({upcomingCount})
            </Button>
            <Button
              type="button"
              variant={filterMode === "PAST" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterMode("PAST")}
              className={`text-xs rounded-xl min-h-[36px] ${
                filterMode === "PAST"
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Histórico ({pastCount})
            </Button>
            <Button
              type="button"
              variant={filterMode === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterMode("ALL")}
              className={`text-xs rounded-xl min-h-[36px] ${
                filterMode === "ALL"
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Todas ({timeOffList.length})
            </Button>
          </div>

          {/* Active Today Indicator */}
          {activeToday && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Profissional em gozo de folga hoje
            </div>
          )}
        </div>
      </div>

      {/* 5 UI States */}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 border rounded-2xl bg-white space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-xl" />
              </div>
              <Skeleton className="h-6 w-56 rounded-md" />
              <Skeleton className="h-4 w-72 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="p-8 border border-rose-200 bg-rose-50/50 rounded-2xl text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
          <h3 className="text-sm font-bold text-rose-900">
            Não foi possível carregar as ausências
          </h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto">
            Houve uma falha na comunicação com o servidor de disponibilidade.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl border-rose-200 text-rose-800 hover:bg-rose-100"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Tentar Novamente
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredList.length === 0 && (
        <div className="border border-dashed border-slate-300 rounded-2xl p-8 sm:p-12 text-center bg-white space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <CalendarOff className="w-7 h-7 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900">
              {filterMode === "UPCOMING"
                ? "Sem ausências agendadas"
                : filterMode === "PAST"
                ? "Sem histórico de ausências passadas"
                : "Nenhuma ausência registada"}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              O profissional estará normalmente disponível para receber agendamentos de acordo com o expediente semanal e os meses abertos.
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Registar Primeira Ausência
            </Button>
          </div>
        </div>
      )}

      {/* Ideal State: List of Time-Off Cards */}
      {!isLoading && !isError && filteredList.length > 0 && (
        <div className="space-y-3">
          {filteredList.map((timeOff) => (
            <TimeOffCard
              key={timeOff.id}
              timeOff={timeOff}
              onDelete={handleDeleteTimeOff}
              isDeleting={deletingId === timeOff.id}
            />
          ))}
        </div>
      )}

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <TimeOffFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateSubmit}
          isSubmitting={createMutation.isPending}
        />
      )}
    </div>
  );
}

