"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Shield, User, Users } from "lucide-react";
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
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { Employee } from "@/types/employee";
import type { SalonService } from "@/types/service";
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from "@/lib/validations/employee";

interface EmployeeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeToEdit?: Employee | null;
  services: SalonService[];
  onSubmit: (values: EmployeeFormValues) => Promise<void>;
}

export function EmployeeFormModal({
  open,
  onOpenChange,
  employeeToEdit,
  services,
  onSubmit,
}: EmployeeFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      displayName: "",
      role: "Cabeleireira Sénior",
      accessRole: "EMPLOYEE",
      phone: "",
      email: "",
      assignedServiceIds: [],
    },
  });

  const selectedAccessRole = watch("accessRole");
  const selectedServiceIds = watch("assignedServiceIds") || [];

  useEffect(() => {
    if (open) {
      if (employeeToEdit) {
        reset({
          displayName: employeeToEdit.displayName,
          role: employeeToEdit.role || "Especialista",
          accessRole: employeeToEdit.accessRole || (employeeToEdit.isOwner ? "OWNER" : "EMPLOYEE"),
          phone: employeeToEdit.phone ? employeeToEdit.phone.replace(/^(\+238|\+?238\s*)/, "") : "",
          email: employeeToEdit.email || "",
          assignedServiceIds: employeeToEdit.assignedServiceIds || [],
        });
      } else {
        reset({
          displayName: "",
          role: "Cabeleireira Sénior",
          accessRole: "EMPLOYEE",
          phone: "",
          email: "",
          assignedServiceIds: [],
        });
      }
    }
  }, [open, employeeToEdit, reset]);

  const toggleService = (serviceId: string) => {
    const current = selectedServiceIds;
    if (current.includes(serviceId)) {
      setValue(
        "assignedServiceIds",
        current.filter((id) => id !== serviceId),
        { shouldValidate: true }
      );
    } else {
      setValue("assignedServiceIds", [...current, serviceId], {
        shouldValidate: true,
      });
    }
  };

  const onFormSubmit = async (data: EmployeeFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      onOpenChange(false);
    } catch {
      // Handled by parent or toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = Boolean(employeeToEdit);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Users className="h-5 w-5" />
            </span>
            <DialogTitle className="text-lg">
              {isEditing ? "Editar Colaborador" : "Adicionar Colaborador à Equipa"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 pt-1">
            {isEditing
              ? "Atualize as informações do profissional, nível de acesso e serviços habilitados."
              : "Cadastre um novo especialista para realizar atendimentos no seu salão."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
          {/* Nome Completo */}
          <div className="space-y-1.5">
            <label
              htmlFor="emp-displayName"
              className="text-xs font-semibold text-slate-700"
            >
              Nome Completo <span className="text-rose-500">*</span>
            </label>
            <Input
              id="emp-displayName"
              placeholder="Ex: Carlos Semedo"
              {...register("displayName")}
              disabled={isSubmitting}
              className="h-11 rounded-xl"
            />
            {errors.displayName && (
              <p className="text-xs text-rose-600">{errors.displayName.message}</p>
            )}
          </div>

          {/* Cargo / Especialidade */}
          <div className="space-y-1.5">
            <label
              htmlFor="emp-role"
              className="text-xs font-semibold text-slate-700"
            >
              Função / Especialidade <span className="text-rose-500">*</span>
            </label>
            <Input
              id="emp-role"
              placeholder="Ex: Barbeiro & Estilo, Trancista Sénior, Manicure"
              {...register("role")}
              disabled={isSubmitting}
              className="h-11 rounded-xl"
            />
            {errors.role && (
              <p className="text-xs text-rose-600">{errors.role.message}</p>
            )}
          </div>

          {/* Contactos: Telefone CV (+238) e Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Telefone (+238) */}
            <div className="space-y-1.5">
              <label
                htmlFor="emp-phone"
                className="text-xs font-semibold text-slate-700"
              >
                Telemóvel (+238) <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <span className="flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 shrink-0">
                  <span>🇨🇻</span>
                  <span>+238</span>
                </span>
                <Input
                  id="emp-phone"
                  type="tel"
                  placeholder="9845512"
                  maxLength={7}
                  {...register("phone")}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl flex-1"
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-rose-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="emp-email"
                className="text-xs font-semibold text-slate-700"
              >
                Email (opcional)
              </label>
              <Input
                id="emp-email"
                type="email"
                placeholder="colaborador@perola.cv"
                {...register("email")}
                disabled={isSubmitting}
                className="h-11 rounded-xl"
              />
              {errors.email && (
                <p className="text-xs text-rose-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Nível de Acesso (Segmented Radio) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700">
              Nível de Permissão e Acesso
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue("accessRole", "EMPLOYEE")}
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-colors ${
                  selectedAccessRole === "EMPLOYEE"
                    ? "border-teal-600 bg-teal-50/50 ring-1 ring-teal-600"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <User className="h-4 w-4 text-teal-700 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Funcionário
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Acesso restrito à própria agenda e marcações diárias.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setValue("accessRole", "OWNER")}
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-colors ${
                  selectedAccessRole === "OWNER"
                    ? "border-teal-600 bg-teal-50/50 ring-1 ring-teal-600"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <Shield className="h-4 w-4 text-teal-700 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Proprietário / Gerente
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Acesso total à gestão da equipa, catálogo e configurações.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Serviços Habilitados */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Serviços Habilitados ({selectedServiceIds.length} selecionados)
              </span>
              <span className="text-[11px] text-slate-500">
                O que este profissional executa
              </span>
            </div>

            {services.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
                Ainda não há serviços no catálogo. Adicione primeiro os serviços na aba Serviços.
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
                {services.map((service) => {
                  const isChecked = selectedServiceIds.includes(service.id);
                  return (
                    <label
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-teal-50/80 border border-teal-200"
                          : "bg-white border border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            isChecked
                              ? "bg-teal-600 border-teal-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {service.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {formatDuration(service.durationMinutes)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-teal-700 shrink-0 font-price pl-2">
                        {formatCurrency(service.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="brand"
              disabled={isSubmitting}
              className="rounded-xl min-w-[130px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A guardar...
                </>
              ) : isEditing ? (
                "Guardar Alterações"
              ) : (
                "Adicionar Colaborador"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

