"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, UserCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { SalonEmployeeSummary, SalonService } from "../types/service.types";

interface AssignSpecialistsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: SalonService | null;
  employees: SalonEmployeeSummary[];
  onSave: (serviceId: string, assignedEmployeeIds: string[]) => Promise<void>;
}

export function AssignSpecialistsModal({
  open,
  onOpenChange,
  service,
  employees,
  onSave,
}: AssignSpecialistsModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && service) {
      // Initialize with currently assigned employee IDs for this service
      const initialAssigned = employees
        .filter((emp) => emp.assignedServiceIds?.includes(service.id))
        .map((emp) => emp.id);

      // Or fallback to service.assignedEmployeeIds if present
      if (initialAssigned.length > 0) {
        setSelectedIds(initialAssigned);
      } else if (service.assignedEmployeeIds) {
        setSelectedIds(service.assignedEmployeeIds);
      } else {
        setSelectedIds([]);
      }
    }
  }, [open, service, employees]);

  if (!service) return null;

  const handleToggle = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, employeeId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== employeeId));
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === employees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(employees.map((e) => e.id));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(service.id, selectedIds);
      onOpenChange(false);
    } catch {
      // Handled by parent or toast
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Users className="h-5 w-5" />
            </span>
            <DialogTitle className="text-lg">Delegar Especialistas</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 pt-1">
            Selecione quais profissionais do salão estão aptos para realizar{" "}
            <strong className="text-slate-800">{service.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {/* Quick Select All */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
            <span className="font-medium text-slate-500">
              {selectedIds.length} de {employees.length} selecionados
            </span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="font-semibold text-teal-700 hover:text-teal-800 focus:outline-none"
            >
              {selectedIds.length === employees.length
                ? "Desmarcar todos"
                : "Selecionar todos"}
            </button>
          </div>

          {/* Employees List */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {employees.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-500">
                  Nenhum profissional cadastrado na equipa deste salão.
                </p>
              </div>
            ) : (
              employees.map((employee) => {
                const isSelected = selectedIds.includes(employee.id);
                return (
                  <div
                    key={employee.id}
                    className={cn(
                      "flex items-center justify-between rounded-xl border p-3 transition-colors",
                      isSelected
                        ? "border-teal-200 bg-teal-50/40"
                        : "border-slate-100 bg-white hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                          isSelected
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 text-slate-700",
                        )}
                      >
                        {employee.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {employee.displayName}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {employee.role || "Especialista"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center pl-2">
                      <Switch
                        id={`switch-emp-${employee.id}`}
                        checked={isSelected}
                        disabled={isSaving}
                        onCheckedChange={(checked) => handleToggle(employee.id, checked)}
                        aria-label={`Habilitar ${employee.displayName}`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="brand"
            disabled={isSaving}
            onClick={handleSave}
            className="rounded-xl min-w-[140px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A guardar...
              </>
            ) : (
              <>
                <Check className="mr-1.5 h-4 w-4" />
                Guardar Atribuições
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

