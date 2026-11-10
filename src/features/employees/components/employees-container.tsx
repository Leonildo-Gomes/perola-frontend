"use client";

import {
  AlertTriangle,
  ChevronRight,
  Plus,
  RefreshCw,
  Scissors,
  Search,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
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
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import type { Employee } from "../types/employee.types";
import type { EmployeeFormValues } from "../schemas/employee.schema";
import { useEmployees } from "../hooks/use-employees";
import {
  useCreateEmployee,
  useDeleteEmployee,
  useChangeEmployeeStatus,
  useUpdateEmployee,
  useUpdateEmployeeServices,
} from "../hooks/use-employee-mutations";
import { useActiveServices } from "@/features/services/hooks/use-services";
import { AssignEmployeeServicesModal } from "./assign-employee-services-modal";
import { EmployeeCard } from "./employee-card";
import { EmployeeFormModal } from "./employee-form-modal";

type TabFilter = "ALL" | "OWNERS" | "STAFF";

export function EmployeesContainer() {
  const user = useAuthStore((s) => s.user);
  const memberships = useAuthStore((s) => s.memberships);
  const activeTenantId = useTenantStore((s) => s.activeBusinessId);

  // Fallback to first available business membership if tenant store is empty
  const businessId = activeTenantId || memberships[0]?.businessId || "";
  const currentMembership = memberships.find((m) => m.businessId === businessId);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("ALL");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [employeeToManageServices, setEmployeeToManageServices] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Queries
  const employeesQuery = useEmployees(businessId);
  const servicesQuery = useActiveServices(businessId);

  const employees = useMemo(() => employeesQuery.data ?? [], [employeesQuery.data]);
  const services = useMemo(() => servicesQuery.data ?? [], [servicesQuery.data]);

  // Derived KPI metrics
  const kpis = useMemo(() => {
    const total = employees.length;
    const activeCount = employees.filter((e) => e.isActive).length;
    const allAssignedServiceIds = new Set<string>();
    employees.forEach((e) => {
      e.assignedServiceIds?.forEach((id) => allAssignedServiceIds.add(id));
    });

    return {
      totalStaff: total,
      activeStaff: activeCount,
      delegatedServicesCount: allAssignedServiceIds.size,
      averageRating: "4.9",
    };
  }, [employees]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const owners = employees.filter(
      (e) => e.isOwner || e.accessRole === "OWNER" || e.userId === user?.id,
    ).length;
    const staff = employees.length - owners;
    return {
      ALL: employees.length,
      OWNERS: owners,
      STAFF: Math.max(0, staff),
    };
  }, [employees, user?.id]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const isOwner =
        emp.isOwner || emp.accessRole === "OWNER" || emp.userId === user?.id;

      // Tab filter
      if (activeTab === "OWNERS" && !isOwner) return false;
      if (activeTab === "STAFF" && isOwner) return false;

      // Search filter
      if (searchQuery.trim() === "") return true;
      const q = searchQuery.toLowerCase();
      const nameMatch = emp.displayName.toLowerCase().includes(q);
      const roleMatch = emp.role ? emp.role.toLowerCase().includes(q) : false;
      const phoneMatch = emp.phone ? emp.phone.includes(q) : false;
      const emailMatch = emp.email ? emp.email.toLowerCase().includes(q) : false;

      return nameMatch || roleMatch || phoneMatch || emailMatch;
    });
  }, [employees, activeTab, searchQuery, user?.id]);

  // Mutations
  const createEmployeeMutation = useCreateEmployee(businessId);
  const updateEmployeeMutation = useUpdateEmployee(businessId);
  const toggleActiveMutation = useChangeEmployeeStatus(businessId);
  const deleteEmployeeMutation = useDeleteEmployee(businessId);
  const updateServicesMutation = useUpdateEmployeeServices(businessId);

  // Handlers
  const handleOpenCreateModal = () => {
    setEmployeeToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (values: EmployeeFormValues) => {
    if (employeeToEdit) {
      await updateEmployeeMutation.mutateAsync({
        employeeId: employeeToEdit.id,
        payload: {
          displayName: values.displayName,
          role: values.role,
          accessRole: values.accessRole,
          phone: values.phone,
          email: values.email || undefined,
          assignedServiceIds: values.assignedServiceIds,
        },
      });
    } else {
      await createEmployeeMutation.mutateAsync({
        displayName: values.displayName,
        role: values.role,
        accessRole: values.accessRole,
        phone: values.phone,
        email: values.email || undefined,
        assignedServiceIds: values.assignedServiceIds,
      });
    }
  };

  const handleToggleActive = (employee: Employee) => {
    toggleActiveMutation.mutate(employee.id);
  };

  const handleSaveAssignedServices = async (employeeId: string, serviceIds: string[]) => {
    await updateServicesMutation.mutateAsync({ employeeId, serviceIds });
  };

  const handleConfirmDelete = async () => {
    if (employeeToDelete) {
      await deleteEmployeeMutation.mutateAsync(employeeToDelete.id);
      setEmployeeToDelete(null);
    }
  };

  // 1. Loading State
  if (employeesQuery.isLoading || servicesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48 rounded-lg" />
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
  if (employeesQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-rose-500 mb-3" />
        <h3 className="text-base font-bold text-rose-900">
          Não foi possível carregar a equipa
        </h3>
        <p className="mt-1 max-w-md text-xs text-rose-700">
          Ocorreu uma falha na ligação com o servidor. Verifique a ligação à internet.
        </p>
        <Button
          variant="outline"
          onClick={() => employeesQuery.refetch()}
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
      {/* Breadcrumb & Header Title */}
      <div className="space-y-2">
        <nav
          aria-label="Caminho de Navegação"
          className="flex items-center gap-1.5 text-xs text-slate-500"
        >
          <Link href="/dashboard" className="hover:text-teal-700 transition-colors">
            Início
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="hover:text-teal-700 transition-colors">Gestão do Salão</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-semibold text-slate-900">Equipa & Colaboradores</span>
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-1">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Gestão da Equipa
              </h1>
              <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-teal-700 border border-teal-200">
                {kpis.activeStaff} COLABORADORES ATIVOS
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-600 border border-slate-200">
                CABO VERDE (+238)
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Faça a gestão dos profissionais, defina permissões de acesso e atribua serviços especializados às respetivas cadeiras de atendimento.
            </p>
          </div>

          <Button
            type="button"
            variant="brand"
            onClick={handleOpenCreateModal}
            className="rounded-xl shadow-sm min-h-[44px] shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Convidar Colaborador
          </Button>
        </div>
      </div>

      {/* KPI Bento Strip */}
      <section aria-label="Métricas da Equipa" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Especialistas em Escala */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Especialistas em Escala
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-bold text-slate-900 font-price">
                {kpis.activeStaff} Ativos
              </p>
              <span className="text-xs font-semibold text-teal-700">Hoje</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600 inline-block"></span>
              {kpis.totalStaff === 0 ? "Sem registos" : "100% de disponibilidade no salão"}
            </p>
          </div>
        </div>

        {/* KPI 2: Serviços Delegados */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-teal-700 shrink-0 border border-slate-200">
            <Scissors className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Serviços Delegados
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-bold text-slate-900 font-price">
                {kpis.delegatedServicesCount} Serviços
              </p>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Distribuídos pelas cadeiras de atendimento
            </p>
          </div>
        </div>

        {/* KPI 3: Avaliação Média */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-200">
            <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Avaliação Média da Equipa
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-bold text-slate-900 font-price">
                {kpis.averageRating} ★
              </p>
              <span className="text-xs text-slate-500">(Excelente)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Com base em avaliações de clientes no marketplace
            </p>
          </div>
        </div>
      </section>

      {/* Filter Toolbar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${activeTab === "ALL"
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Todos os Membros ({tabCounts.ALL})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("OWNERS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${activeTab === "OWNERS"
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Proprietários ({tabCounts.OWNERS})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("STAFF")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${activeTab === "STAFF"
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Funcionários ({tabCounts.STAFF})
          </button>
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por nome ou especialidade..."
            className="pl-9 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs"
          />
        </div>
      </div>

      {/* 3. Empty State (0 members registered) */}
      {employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 mb-4">
            <Users className="h-7 w-7" />
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            Ainda não tem colaboradores cadastrados
          </h3>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            Adicione os especialistas e profissionais que realizam atendimentos no seu salão em Cabo Verde.
          </p>
          <Button
            type="button"
            variant="brand"
            onClick={handleOpenCreateModal}
            className="mt-6 rounded-xl min-h-[44px]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Primeiro Colaborador
          </Button>
        </div>
      ) : filteredEmployees.length === 0 ? (
        /* 4. Filtered Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Search className="h-8 w-8 text-slate-400 mb-2" />
          <h4 className="text-sm font-semibold text-slate-800">
            Nenhum colaborador encontrado
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Não encontramos colaboradores correspondentes ao filtro ou pesquisa realizada.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setActiveTab("ALL");
            }}
            className="mt-4 rounded-xl text-xs"
          >
            Limpar Filtros
          </Button>
        </div>
      ) : (
        /* 5. Ideal State: Table & Cards */
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Mobile List Container */}
          <div className="divide-y divide-slate-100 p-3 space-y-3 md:hidden">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                services={services}
                isCurrentOwner={
                  employee.isOwner ||
                  employee.accessRole === "OWNER" ||
                  employee.userId === user?.id
                }
                onToggleActive={handleToggleActive}
                onEdit={handleOpenEditModal}
                onManageServices={(emp) => setEmployeeToManageServices(emp)}
                onDelete={(emp) => setEmployeeToDelete(emp)}
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
                    Colaborador
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Papel / Acesso
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Especialidade & Nota
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Serviços Autorizados
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Horário Semanal
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center">
                    Status
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-4 text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    services={services}
                    isCurrentOwner={
                      employee.isOwner ||
                      employee.accessRole === "OWNER" ||
                      employee.userId === user?.id
                    }
                    onToggleActive={handleToggleActive}
                    onEdit={handleOpenEditModal}
                    onManageServices={(emp) => setEmployeeToManageServices(emp)}
                    onDelete={(emp) => setEmployeeToDelete(emp)}
                    isPending={toggleActiveMutation.isPending}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Adicionar / Editar Colaborador */}
      <EmployeeFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        employeeToEdit={employeeToEdit}
        services={services}
        onSubmit={handleFormSubmit}
      />

      {/* Modal: Atribuir Serviços Rápidos ao Colaborador */}
      <AssignEmployeeServicesModal
        open={Boolean(employeeToManageServices)}
        onOpenChange={(open) => !open && setEmployeeToManageServices(null)}
        employee={employeeToManageServices}
        services={services}
        onSave={handleSaveAssignedServices}
      />

      {/* Modal: Confirmação de Remoção de Colaborador */}
      <Dialog
        open={Boolean(employeeToDelete)}
        onOpenChange={(open) => !open && setEmployeeToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <DialogTitle className="text-lg">Remover Colaborador</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500 pt-1">
              Tem a certeza de que deseja remover{" "}
              <strong className="text-slate-800">{employeeToDelete?.displayName}</strong> da
              equipa do salão? Esta ação desativa o profissional e cancela a sua agenda de marcações.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={deleteEmployeeMutation.isPending}
              onClick={() => setEmployeeToDelete(null)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteEmployeeMutation.isPending}
              onClick={handleConfirmDelete}
              className="rounded-xl min-w-[100px]"
            >
              {deleteEmployeeMutation.isPending ? "A remover..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const TeamContainer = EmployeesContainer;



