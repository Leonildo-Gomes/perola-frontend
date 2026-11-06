"use client";

import { AlertTriangle, Clock, Edit2, MoreVertical, Trash2, UserPlus, Users } from "lucide-react";
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
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { SalonEmployeeSummary, SalonService } from "@/types/service";

interface ServiceListItemProps {
  service: SalonService;
  assignedEmployees: SalonEmployeeSummary[];
  onToggleActive: (service: SalonService, active: boolean) => void;
  onEdit: (service: SalonService) => void;
  onDelete: (service: SalonService) => void;
  onAssignSpecialists: (service: SalonService) => void;
  isPending?: boolean;
}

export function ServiceListItem({
  service,
  assignedEmployees,
  onToggleActive,
  onEdit,
  onDelete,
  onAssignSpecialists,
  isPending = false,
}: ServiceListItemProps) {
  const hasNoSpecialists = service.isActive && assignedEmployees.length === 0;

  return (
    <>
      {/* Mobile Card Layout (< md) */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 text-base">{service.name}</span>
              {service.category && (
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                  {service.category}
                </Badge>
              )}
            </div>
            {service.description && (
              <p className="mt-1 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                {service.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Switch
              id={`switch-mobile-${service.id}`}
              checked={service.isActive}
              disabled={isPending}
              onCheckedChange={(checked) => onToggleActive(service, checked)}
              aria-label={`Ativar ou desativar serviço ${service.name}`}
            />
          </div>
        </div>

        {/* Pricing & Duration */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>{formatDuration(service.durationMinutes)}</span>
          </div>
          <span className="font-bold text-teal-700 text-base font-price">
            {formatCurrency(service.price)}
          </span>
        </div>

        {/* Assigned Staff or Warning */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          {hasNoSpecialists ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span>Sem profissionais vinculados</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5 overflow-hidden">
                {assignedEmployees.slice(0, 3).map((emp) => (
                  <div
                    key={emp.id}
                    title={emp.displayName}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 border-2 border-white text-[11px] font-bold text-teal-800"
                  >
                    {emp.displayName.slice(0, 2).toUpperCase()}
                  </div>
                ))}
                {assignedEmployees.length > 3 && (
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 border-2 border-white text-[10px] font-semibold text-slate-600">
                    +{assignedEmployees.length - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-500">
                {assignedEmployees.length === 1
                  ? "1 profissional"
                  : `${assignedEmployees.length} profissionais`}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAssignSpecialists(service)}
              className="h-8 rounded-lg px-2.5 text-xs text-teal-700 border-teal-200 bg-teal-50/50 hover:bg-teal-50"
            >
              <Users className="mr-1.5 h-3.5 w-3.5" />
              Delegar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <MoreVertical className="h-4 w-4 text-slate-500" />
                  <span className="sr-only">Ações do serviço</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl">
                <DropdownMenuItem onClick={() => onEdit(service)} className="text-xs font-medium cursor-pointer">
                  <Edit2 className="mr-2 h-3.5 w-3.5" />
                  Editar dados
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAssignSpecialists(service)} className="text-xs font-medium cursor-pointer">
                  <UserPlus className="mr-2 h-3.5 w-3.5" />
                  Gerir especialistas
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(service)}
                  className="text-xs font-medium text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Eliminar serviço
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Desktop Table Row (>= md) */}
      <tr className="hidden md:table-row border-b border-slate-100 hover:bg-slate-50/75 transition-colors">
        {/* Service Name & Category */}
        <td className="py-4 pl-4 pr-3 align-middle">
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 text-sm">{service.name}</span>
            {service.description ? (
              <span className="line-clamp-1 text-xs text-slate-500 max-w-xs">
                {service.description}
              </span>
            ) : null}
          </div>
        </td>

        {/* Category */}
        <td className="px-3 py-4 align-middle">
          <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
            {service.category || "Geral"}
          </Badge>
        </td>

        {/* Duration */}
        <td className="px-3 py-4 align-middle text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {formatDuration(service.durationMinutes)}
          </span>
        </td>

        {/* Price */}
        <td className="px-3 py-4 align-middle font-semibold text-slate-900 text-sm font-price">
          {formatCurrency(service.price)}
        </td>

        {/* Specialists */}
        <td className="px-3 py-4 align-middle">
          {hasNoSpecialists ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span>Sem profissionais</span>
            </div>
          ) : assignedEmployees.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5 overflow-hidden">
                {assignedEmployees.slice(0, 3).map((emp) => (
                  <div
                    key={emp.id}
                    title={emp.displayName}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 border-2 border-white text-[11px] font-bold text-teal-800"
                  >
                    {emp.displayName.slice(0, 2).toUpperCase()}
                  </div>
                ))}
                {assignedEmployees.length > 3 && (
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 border-2 border-white text-[10px] font-semibold text-slate-600">
                    +{assignedEmployees.length - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-500">
                {assignedEmployees.length === 1
                  ? "1 profissional"
                  : `${assignedEmployees.length} aptos`}
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">Nenhum</span>
          )}
        </td>

        {/* Active Toggle */}
        <td className="px-3 py-4 align-middle text-center">
          <div className="inline-flex items-center gap-2">
            <Switch
              id={`switch-desktop-${service.id}`}
              checked={service.isActive}
              disabled={isPending}
              onCheckedChange={(checked) => onToggleActive(service, checked)}
              aria-label={`Ativar ou desativar serviço ${service.name}`}
            />
            <span className="text-xs font-medium text-slate-500">
              {service.isActive ? "Ativo" : "Inativo"}
            </span>
          </div>
        </td>

        {/* Actions */}
        <td className="py-4 pl-3 pr-4 align-middle text-right">
          <div className="inline-flex items-center justify-end gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAssignSpecialists(service)}
              className="h-8 rounded-lg px-2.5 text-xs text-teal-700 border-teal-200 bg-teal-50/50 hover:bg-teal-50"
            >
              <Users className="mr-1.5 h-3.5 w-3.5" />
              Delegar
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(service)}
              className="h-8 rounded-lg px-2 text-xs text-slate-600 hover:text-slate-900"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span className="sr-only">Editar {service.name}</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <MoreVertical className="h-4 w-4 text-slate-500" />
                  <span className="sr-only">Mais opções</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl">
                <DropdownMenuItem onClick={() => onEdit(service)} className="text-xs font-medium cursor-pointer">
                  <Edit2 className="mr-2 h-3.5 w-3.5" />
                  Editar detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAssignSpecialists(service)} className="text-xs font-medium cursor-pointer">
                  <UserPlus className="mr-2 h-3.5 w-3.5" />
                  Gerir especialistas
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(service)}
                  className="text-xs font-medium text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Eliminar serviço
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>
    </>
  );
}

