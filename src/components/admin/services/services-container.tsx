"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  Plus,
  RefreshCw,
  Scissors,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import {
  createSalonService,
  deleteSalonService,
  getSalonEmployees,
  getSalonServices,
  setEmployeeServices,
  updateSalonService,
} from "@/lib/api/services";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import type {
  CreateServicePayload,
  SalonEmployeeSummary,
  SalonService,
  UpdateServicePayload,
} from "@/types/service";
import type { ServiceFormValues } from "@/lib/validations/service";
import { AssignSpecialistsModal } from "./assign-specialists-modal";
import { ServiceFormModal } from "./service-form-modal";
import { ServiceListItem } from "./service-list-item";

export function ServicesContainer() {
  const queryClient = useQueryClient();
  const memberships = useAuthStore((s) => s.memberships);
  const activeTenantId = useTenantStore((s) => s.activeBusinessId);

  // Fallback to first available business membership if tenant store is empty
  const businessId = activeTenantId || memberships[0]?.businessId || "";

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<SalonService | null>(null);
  const [serviceToDelegate, setServiceToDelegate] = useState<SalonService | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<SalonService | null>(null);

  // Queries
  const servicesQuery = useQuery({
    queryKey: ["salon-services", businessId],
    queryFn: ({ signal }) => getSalonServices(businessId, signal),
    enabled: Boolean(businessId),
    staleTime: 30_000,
  });

  const employeesQuery = useQuery({
    queryKey: ["salon-employees", businessId],
    queryFn: ({ signal }) => getSalonEmployees(businessId, signal),
    enabled: Boolean(businessId),
    staleTime: 60_000,
  });

  const services = useMemo(() => servicesQuery.data ?? [], [servicesQuery.data]);
  const employees = useMemo(() => employeesQuery.data ?? [], [employeesQuery.data]);

  // Derived KPI metrics
  const kpis = useMemo(() => {
    if (services.length === 0) {
      return {
        totalServices: 0,
        avgDurationMinutes: 0,
        avgPrice: 0,
        activeSpecialists: employees.filter((e) => e.isActive).length,
      };
    }

    const totalDuration = services.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalPrice = services.reduce((acc, s) => acc + Number(s.price), 0);

    return {
      totalServices: services.length,
      avgDurationMinutes: Math.round(totalDuration / services.length),
      avgPrice: Math.round(totalPrice / services.length),
      activeSpecialists: employees.filter((e) => e.isActive).length,
    };
  }, [services, employees]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: services.length };
    services.forEach((s) => {
      const cat = (s.category || "OUTRO").toUpperCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [services]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "ALL" ||
        (s.category && s.category.toUpperCase() === selectedCategory.toUpperCase());

      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, selectedCategory]);

  // Map employee assignment for each service
  const getAssignedEmployeesForService = (service: SalonService): SalonEmployeeSummary[] => {
    return employees.filter((emp) => {
      if (emp.assignedServiceIds && emp.assignedServiceIds.includes(service.id)) {
        return true;
      }
      if (service.assignedEmployeeIds && service.assignedEmployeeIds.includes(emp.id)) {
        return true;
      }
      return false;
    });
  };

  // Mutations
  const createServiceMutation = useMutation({
    mutationFn: (payload: CreateServicePayload) => createSalonService(businessId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["salon-services", businessId] });
      toast.success("Serviço criado com sucesso no catálogo!");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Erro ao criar serviço.");
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ serviceId, payload }: { serviceId: string; payload: UpdateServicePayload }) =>
      updateSalonService(businessId, serviceId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["salon-services", businessId] });
      toast.success("Serviço atualizado com sucesso!");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar serviço.");
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ service, active }: { service: SalonService; active: boolean }) =>
      updateSalonService(businessId, service.id, { isActive: active }),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["salon-services", businessId] });
      toast.success(
        variables.active
          ? `Serviço "${variables.service.name}" ativado com sucesso.`
          : `Serviço "${variables.service.name}" desativado.`
      );
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Erro ao alterar estado do serviço.");
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (serviceId: string) => deleteSalonService(businessId, serviceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["salon-services", businessId] });
      toast.success("Serviço removido com sucesso.");
      setServiceToDelete(null);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Erro ao remover serviço.");
    },
  });

  const assignSpecialistsMutation = useMutation({
    mutationFn: async ({
      serviceId,
      assignedEmployeeIds,
    }: {
      serviceId: string;
      assignedEmployeeIds: string[];
    }) => {
      // Update each employee's assigned services list
      const updates = employees.map(async (emp) => {
        const currentlyHas = emp.assignedServiceIds?.includes(serviceId) ?? false;
        const shouldHave = assignedEmployeeIds.includes(emp.id);

        if (currentlyHas !== shouldHave) {
          const currentList = emp.assignedServiceIds ?? [];
          const nextList = shouldHave
            ? [...currentList, serviceId]
            : currentList.filter((id) => id !== serviceId);
          await setEmployeeServices(businessId, emp.id, nextList);
        }
      });
      await Promise.all(updates);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["salon-services", businessId] });
      void queryClient.invalidateQueries({ queryKey: ["salon-employees", businessId] });
      toast.success("Especialistas atualizados para o serviço!");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Erro ao delegar especialistas.");
    },
  });

  // Handlers
  const handleOpenCreateModal = () => {
    setServiceToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (service: SalonService) => {
    setServiceToEdit(service);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (values: ServiceFormValues) => {
    if (serviceToEdit) {
      await updateServiceMutation.mutateAsync({
        serviceId: serviceToEdit.id,
        payload: {
          name: values.name,
          category: values.category,
          durationMinutes: values.durationMinutes,
          price: values.price,
          description: values.description || undefined,
        },
      });
    } else {
      await createServiceMutation.mutateAsync({
        name: values.name,
        category: values.category,
        durationMinutes: values.durationMinutes,
        price: values.price,
        description: values.description || undefined,
      });
    }
  };

  const handleToggleActive = (service: SalonService, active: boolean) => {
    toggleActiveMutation.mutate({ service, active });
  };

  const handleSaveDelegation = async (serviceId: string, assignedEmployeeIds: string[]) => {
    await assignSpecialistsMutation.mutateAsync({ serviceId, assignedEmployeeIds });
  };

  const handleConfirmDelete = async () => {
    if (serviceToDelete) {
      await deleteServiceMutation.mutateAsync(serviceToDelete.id);
    }
  };

  // 1. Loading State
  if (servicesQuery.isLoading || employeesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // 2. Error State
  if (servicesQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-rose-500 mb-3" />
        <h3 className="text-base font-bold text-rose-900">
          Não foi possível carregar os serviços
        </h3>
        <p className="mt-1 max-w-md text-xs text-rose-700">
          Ocorreu uma falha na ligação com o servidor do salão. Verifique a ligação à internet.
        </p>
        <Button
          variant="outline"
          onClick={() => servicesQuery.refetch()}
          className="mt-4 rounded-xl border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Catálogo de Serviços
          </h1>
          <p className="text-sm text-slate-500">
            Gerir tratamentos, durações, preços em CVE e delegação de profissionais habilitados.
          </p>
        </div>
        <Button
          type="button"
          variant="brand"
          onClick={handleOpenCreateModal}
          className="rounded-xl shadow-sm min-h-[44px]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Serviços
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Scissors className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-price">
              {kpis.totalServices}
            </span>
            <span className="text-xs text-slate-500">no catálogo</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Duração Média
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-price">
              {kpis.avgDurationMinutes}
            </span>
            <span className="text-xs text-slate-500">minutos</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Ticket Médio
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-teal-700 font-price">
              {formatCurrency(kpis.avgPrice)}
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Especialistas
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-price">
              {kpis.activeSpecialists}
            </span>
            <span className="text-xs text-slate-500">ativos na equipa</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome do serviço ou descrição..."
            className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
              selectedCategory === "ALL"
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todos ({categoryCounts.ALL || 0})
          </button>
          {["CABELO", "UNHAS", "BARBEARIA", "ESTETICA", "MASSAGEM", "OUTRO"].map((cat) => {
            const count = categoryCounts[cat] || 0;
            if (count === 0 && selectedCategory !== cat) return null;
            const labels: Record<string, string> = {
              CABELO: "Cabelo",
              UNHAS: "Unhas",
              BARBEARIA: "Barbearia",
              ESTETICA: "Estética",
              MASSAGEM: "Massagem",
              OUTRO: "Outro",
            };
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {labels[cat] || cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Empty Catalog State */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 mb-4">
            <Sparkles className="h-7 w-7" />
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            Ainda não tem serviços registados
          </h3>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            Crie o catálogo de tratamentos e cuidados do seu salão para permitir marcações online aos clientes em Cabo Verde.
          </p>
          <Button
            type="button"
            variant="brand"
            onClick={handleOpenCreateModal}
            className="mt-6 rounded-xl min-h-[44px]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Serviço
          </Button>
        </div>
      ) : filteredServices.length === 0 ? (
        /* 4. Filtered Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Search className="h-8 w-8 text-slate-400 mb-2" />
          <h4 className="text-sm font-semibold text-slate-800">
            Nenhum serviço encontrado
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Não encontramos serviços com o termo de pesquisa ou categoria selecionada.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
            }}
            className="mt-4 rounded-xl text-xs"
          >
            Limpar Filtros
          </Button>
        </div>
      ) : (
        /* 5. Ideal State: Services Table & Cards */
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Mobile List Container */}
          <div className="divide-y divide-slate-100 p-3 space-y-3 md:hidden">
            {filteredServices.map((service) => (
              <ServiceListItem
                key={service.id}
                service={service}
                assignedEmployees={getAssignedEmployeesForService(service)}
                onToggleActive={handleToggleActive}
                onEdit={handleOpenEditModal}
                onDelete={(s) => setServiceToDelete(s)}
                onAssignSpecialists={(s) => setServiceToDelegate(s)}
                isPending={toggleActiveMutation.isPending}
              />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="py-3.5 pl-4 pr-3">
                    Serviço
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Categoria
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Duração
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Preço (CVE)
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Especialistas
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center">
                    Estado
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-4 text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map((service) => (
                  <ServiceListItem
                    key={service.id}
                    service={service}
                    assignedEmployees={getAssignedEmployeesForService(service)}
                    onToggleActive={handleToggleActive}
                    onEdit={handleOpenEditModal}
                    onDelete={(s) => setServiceToDelete(s)}
                    onAssignSpecialists={(s) => setServiceToDelegate(s)}
                    isPending={toggleActiveMutation.isPending}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Criar / Editar Serviço */}
      <ServiceFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        serviceToEdit={serviceToEdit}
        onSubmit={handleFormSubmit}
      />

      {/* Modal: Delegar Especialistas */}
      <AssignSpecialistsModal
        open={Boolean(serviceToDelegate)}
        onOpenChange={(open) => !open && setServiceToDelegate(null)}
        service={serviceToDelegate}
        employees={employees}
        onSave={handleSaveDelegation}
      />

      {/* Modal: Confirmação de Eliminação */}
      <Dialog
        open={Boolean(serviceToDelete)}
        onOpenChange={(open) => !open && setServiceToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <DialogTitle className="text-lg">Eliminar Serviço</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500 pt-1">
              Tem a certeza de que deseja remover o serviço{" "}
              <strong className="text-slate-800">{serviceToDelete?.name}</strong> do catálogo?
              Esta ação desativa o serviço e impede novas marcações.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={deleteServiceMutation.isPending}
              onClick={() => setServiceToDelete(null)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteServiceMutation.isPending}
              onClick={handleConfirmDelete}
              className="rounded-xl min-w-[100px]"
            >
              {deleteServiceMutation.isPending ? "A remover..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

