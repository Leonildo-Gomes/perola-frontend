"use client";

import {
  AlertTriangle,
  Calendar,
  Clock,
  Edit2,
  Mail,
  MoreVertical,
  Phone,
  Scissors,
  Shield,
  Star,
  Trash2,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { Employee } from "@/types/employee";
import type { SalonService } from "@/types/service";

interface EmployeeCardProps {
  employee: Employee;
  services: SalonService[];
  isCurrentOwner?: boolean;
  onToggleActive: (employee: Employee, active: boolean) => void;
  onEdit: (employee: Employee) => void;
  onManageServices: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  isPending?: boolean;
}

export function EmployeeCard({
  employee,
  services,
  isCurrentOwner = false,
  onToggleActive,
  onEdit,
  onManageServices,
  onDelete,
  isPending = false,
}: EmployeeCardProps) {
  const isOwner = employee.isOwner || employee.accessRole === "OWNER" || isCurrentOwner;
  const isInactive = !employee.isActive;

  // Resolve assigned service names
  const assignedServices = services.filter((s) =>
    employee.assignedServiceIds?.includes(s.id),
  );

  return (
    <>
      {/* ========================================================================= */}
      {/* Mobile Card Layout (< md)                                                 */}
      {/* ========================================================================= */}
      <div
        className={cn(
          "flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-opacity md:hidden",
          isInactive
            ? "border-slate-200 bg-slate-50/70 opacity-60"
            : "border-slate-200",
        )}
      >
        {/* Top Header: Avatar, Name, Role Badge, Active Toggle */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                isOwner
                  ? "bg-teal-100 text-teal-800 ring-2 ring-teal-600/30"
                  : "bg-slate-100 text-slate-700",
              )}
            >
              {employee.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-slate-900 text-sm truncate">
                  {employee.displayName}
                </span>
                {isOwner ? (
                  <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-[10px] font-bold px-2 py-0">
                    <Shield className="mr-1 h-3 w-3 inline" />
                    Proprietário Principal
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-200 px-2 py-0">
                    Funcionário
                  </Badge>
                )}
                {isInactive && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                    INATIVO
                  </Badge>
                )}
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">
                {employee.role || "Especialista"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Switch
              id={`switch-mobile-${employee.id}`}
              checked={employee.isActive}
              disabled={isPending}
              onCheckedChange={(checked) => onToggleActive(employee, checked)}
              aria-label={`Ativar ou desativar colaborador ${employee.displayName}`}
            />
          </div>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-1 border-t border-slate-100 pt-2 text-xs text-slate-600">
          {employee.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>+238 {employee.phone}</span>
            </div>
          )}
          {employee.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{employee.email}</span>
            </div>
          )}
        </div>

        {/* Assigned Services Tags */}
        <div className="border-t border-slate-100 pt-2">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="font-semibold text-slate-500">Serviços Habilitados:</span>
            <button
              type="button"
              onClick={() => onManageServices(employee)}
              className="text-teal-700 font-semibold hover:underline text-[11px]"
            >
              Gerir ({assignedServices.length})
            </button>
          </div>
          {assignedServices.length === 0 ? (
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700 border border-amber-200">
              <AlertTriangle className="h-3 w-3 shrink-0 text-amber-500" />
              <span>Sem serviços vinculados</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 flex-wrap">
              {assignedServices.slice(0, 3).map((s) => (
                <span
                  key={s.id}
                  className="rounded-md bg-teal-50/70 border border-teal-200 px-2 py-0.5 text-[11px] font-medium text-teal-800"
                >
                  {s.name}
                </span>
              ))}
              {assignedServices.length > 3 && (
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                  +{assignedServices.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs font-semibold text-slate-700"
          >
            <Link href={`/availability?employeeId=${employee.id}`}>
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-teal-600" />
              Gerir Expediente
            </Link>
          </Button>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEdit(employee)}
              className="h-8 rounded-lg px-2.5 text-xs text-slate-700 hover:text-slate-900"
            >
              <Edit2 className="mr-1.5 h-3.5 w-3.5" />
              Editar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <MoreVertical className="h-4 w-4 text-slate-500" />
                  <span className="sr-only">Opções</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl">
                <DropdownMenuItem onClick={() => onEdit(employee)} className="text-xs font-medium cursor-pointer">
                  <Edit2 className="mr-2 h-3.5 w-3.5" />
                  Editar perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onManageServices(employee)} className="text-xs font-medium cursor-pointer">
                  <Scissors className="mr-2 h-3.5 w-3.5" />
                  Serviços habilitados
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-xs font-medium cursor-pointer">
                  <Link href={`/availability?employeeId=${employee.id}`}>
                    <Calendar className="mr-2 h-3.5 w-3.5" />
                    Expediente e horários
                  </Link>
                </DropdownMenuItem>
                {!isOwner && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(employee)}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Remover da equipa
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Desktop Table Row (>= md)                                                 */}
      {/* ========================================================================= */}
      <tr
        className={cn(
          "hidden md:table-row border-b border-slate-100 transition-colors hover:bg-slate-50/75",
          isInactive && "bg-slate-50/50 opacity-60",
        )}
      >
        {/* Colaborador: Avatar, Nome, Telefone, Email */}
        <td className="py-4 pl-4 pr-3 align-middle">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                isOwner
                  ? "bg-teal-100 text-teal-800 ring-2 ring-teal-600/30"
                  : "bg-slate-100 text-slate-700",
              )}
            >
              {employee.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-900 text-sm truncate">
                {employee.displayName}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                {employee.phone && <span>+238 {employee.phone}</span>}
                {employee.phone && employee.email && <span>•</span>}
                {employee.email && <span className="truncate max-w-[150px]">{employee.email}</span>}
              </div>
            </div>
          </div>
        </td>

        {/* Papel / Acesso */}
        <td className="px-3 py-4 align-middle">
          {isOwner ? (
            <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-xs font-bold px-2.5 py-0.5">
              <Shield className="mr-1.5 h-3 w-3 inline" />
              Proprietário Principal
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200 px-2.5 py-0.5">
              Funcionário
            </Badge>
          )}
        </td>

        {/* Especialidade & Avaliação */}
        <td className="px-3 py-4 align-middle">
          <div className="flex flex-col">
            <span className="font-medium text-slate-900 text-sm">
              {employee.role || "Especialista"}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-0.5">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span>{employee.rating ? employee.rating.toFixed(1) : "4.9"}</span>
              <span className="text-slate-400 font-normal">
                ({employee.reviewCount || 12} avaliações)
              </span>
            </div>
          </div>
        </td>

        {/* Serviços Autorizados */}
        <td className="px-3 py-4 align-middle">
          {assignedServices.length === 0 ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
              <AlertTriangle className="h-3 w-3 shrink-0 text-amber-500" />
              <span>Sem serviços</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
              {assignedServices.slice(0, 2).map((s) => (
                <span
                  key={s.id}
                  className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700"
                >
                  {s.name}
                </span>
              ))}
              {assignedServices.length > 2 && (
                <button
                  type="button"
                  onClick={() => onManageServices(employee)}
                  className="rounded-md bg-teal-50 border border-teal-200 px-1.5 py-0.5 text-xs font-bold text-teal-700 hover:bg-teal-100"
                >
                  +{assignedServices.length - 2}
                </button>
              )}
            </div>
          )}
        </td>

        {/* Horário Semanal / Atalho de Expediente */}
        <td className="px-3 py-4 align-middle text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div>
              <span className="font-medium text-slate-800">
                {employee.workingHoursSummary || "08:00 - 18:00"}
              </span>
              <div className="text-[11px] text-slate-400">Ter - Sáb</div>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-teal-700 hover:bg-teal-50"
              title="Gerir expediente no calendário"
            >
              <Link href={`/availability?employeeId=${employee.id}`}>
                <Calendar className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </td>

        {/* Status Switch */}
        <td className="px-3 py-4 align-middle text-center">
          <div className="inline-flex flex-col items-center gap-1">
            <Switch
              id={`switch-desktop-${employee.id}`}
              checked={employee.isActive}
              disabled={isPending}
              onCheckedChange={(checked) => onToggleActive(employee, checked)}
              aria-label={`Ativar ou desativar colaborador ${employee.displayName}`}
            />
            <span
              className={cn(
                "text-[10px] font-bold uppercase",
                employee.isActive ? "text-teal-700" : "text-rose-600",
              )}
            >
              {employee.isActive ? "Ativo" : "Inativo"}
            </span>
          </div>
        </td>

        {/* Ações */}
        <td className="py-4 pl-3 pr-4 align-middle text-right">
          <div className="inline-flex items-center justify-end gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onManageServices(employee)}
              className="h-8 rounded-lg px-2.5 text-xs text-teal-700 border-teal-200 bg-teal-50/50 hover:bg-teal-50"
            >
              <Scissors className="mr-1.5 h-3.5 w-3.5" />
              Serviços
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(employee)}
              className="h-8 rounded-lg px-2.5 text-xs text-slate-600 hover:text-slate-900"
            >
              <Edit2 className="mr-1.5 h-3.5 w-3.5" />
              Editar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <MoreVertical className="h-4 w-4 text-slate-500" />
                  <span className="sr-only">Mais opções</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem onClick={() => onEdit(employee)} className="text-xs font-medium cursor-pointer">
                  <Edit2 className="mr-2 h-3.5 w-3.5" />
                  Editar perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onManageServices(employee)} className="text-xs font-medium cursor-pointer">
                  <Scissors className="mr-2 h-3.5 w-3.5" />
                  Serviços habilitados
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-xs font-medium cursor-pointer">
                  <Link href={`/availability?employeeId=${employee.id}`}>
                    <Calendar className="mr-2 h-3.5 w-3.5" />
                    Gerir expediente semanal
                  </Link>
                </DropdownMenuItem>
                {!isOwner && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(employee)}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Remover da equipa
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>
    </>
  );
}

