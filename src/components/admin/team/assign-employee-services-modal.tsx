"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { Employee } from "@/types/employee";
import type { SalonService } from "@/types/service";

interface AssignEmployeeServicesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  services: SalonService[];
  onSave: (employeeId: string, serviceIds: string[]) => Promise<void>;
}

export function AssignEmployeeServicesModal({
  open,
  onOpenChange,
  employee,
  services,
  onSave,
}: AssignEmployeeServicesModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && employee) {
      setSelectedIds(employee.assignedServiceIds || []);
    }
  }, [open, employee]);

  if (!employee) return null;

  const handleToggle = (serviceId: string) => {
    if (selectedIds.includes(serviceId)) {
      setSelectedIds((prev) => prev.filter((id) => id !== serviceId));
    } else {
      setSelectedIds((prev) => [...prev, serviceId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === services.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(services.map((s) => s.id));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(employee.id, selectedIds);
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
              <Scissors className="h-5 w-5" />
            </span>
            <DialogTitle className="text-lg">Serviços Habilitados</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 pt-1">
            Defina quais serviços <strong className="text-slate-800">{employee.displayName}</strong> está autorizado a executar no salão.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {/* Quick Select All */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
            <span className="font-medium text-slate-500">
              {selectedIds.length} de {services.length} serviços selecionados
            </span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="font-semibold text-teal-700 hover:text-teal-800 focus:outline-none"
            >
              {selectedIds.length === services.length
                ? "Desmarcar todos"
                : "Selecionar todos"}
            </button>
          </div>

          {/* Services list */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {services.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Nenhum serviço registado no catálogo deste salão.
              </div>
            ) : (
              services.map((service) => {
                const isSelected = selectedIds.includes(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => handleToggle(service.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      isSelected
                        ? "border-teal-200 bg-teal-50/40"
                        : "border-slate-100 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          isSelected
                            ? "bg-teal-600 border-teal-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {service.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDuration(service.durationMinutes)} • {service.category || "Geral"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-teal-700 font-price pl-2">
                      {formatCurrency(service.price)}
                    </span>
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
                Guardar Serviços
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

