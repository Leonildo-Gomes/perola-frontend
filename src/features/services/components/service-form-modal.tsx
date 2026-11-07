"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SERVICE_CATEGORIES,
  type SalonService,
} from "../types/service.types";
import {
  serviceFormSchema,
  type ServiceFormValues,
} from "../schemas/service.schema";

const DURATION_OPTIONS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "1h (60 min)" },
  { value: "75", label: "1h 15 min" },
  { value: "90", label: "1h 30 min" },
  { value: "120", label: "2h (120 min)" },
  { value: "150", label: "2h 30 min" },
  { value: "180", label: "3h (180 min)" },
];

interface ServiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceToEdit?: SalonService | null;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
}

export function ServiceFormModal({
  open,
  onOpenChange,
  serviceToEdit,
  onSubmit,
}: ServiceFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      category: "CABELO",
      durationMinutes: 45,
      price: 2000,
      description: "",
    },
  });

  const selectedCategory = watch("category");
  const selectedDuration = watch("durationMinutes");

  useEffect(() => {
    if (open) {
      if (serviceToEdit) {
        reset({
          name: serviceToEdit.name,
          category: serviceToEdit.category || "CABELO",
          durationMinutes: serviceToEdit.durationMinutes,
          price: serviceToEdit.price,
          description: serviceToEdit.description || "",
        });
      } else {
        reset({
          name: "",
          category: "CABELO",
          durationMinutes: 45,
          price: 2000,
          description: "",
        });
      }
    }
  }, [open, serviceToEdit, reset]);

  const onFormSubmit = async (data: ServiceFormValues) => {
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

  const isEditing = Boolean(serviceToEdit);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Serviço" : "Novo Serviço"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações, tempo de execução e preço do serviço."
              : "Adicione um novo serviço ao catálogo do seu salão em Cabo Verde."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
          {/* Nome do Serviço */}
          <div className="space-y-1.5">
            <label
              htmlFor="service-name"
              className="text-xs font-semibold text-slate-700"
            >
              Nome do Serviço <span className="text-rose-500">*</span>
            </label>
            <Input
              id="service-name"
              placeholder="Ex: Corte Feminino & Brushing"
              {...register("name")}
              disabled={isSubmitting}
              className="h-11 rounded-xl"
            />
            {errors.name && (
              <p className="text-xs text-rose-600">{errors.name.message}</p>
            )}
          </div>

          {/* Categoria */}
          <div className="space-y-1.5">
            <label
              htmlFor="service-category"
              className="text-xs font-semibold text-slate-700"
            >
              Categoria <span className="text-rose-500">*</span>
            </label>
            <Select
              value={selectedCategory}
              onValueChange={(val) => setValue("category", val, { shouldValidate: true })}
              disabled={isSubmitting}
            >
              <SelectTrigger id="service-category" className="h-11 rounded-xl">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-rose-600">{errors.category.message}</p>
            )}
          </div>

          {/* Duração & Preço */}
          <div className="grid grid-cols-2 gap-3">
            {/* Duração */}
            <div className="space-y-1.5">
              <label
                htmlFor="service-duration"
                className="text-xs font-semibold text-slate-700"
              >
                Duração <span className="text-rose-500">*</span>
              </label>
              <Select
                value={selectedDuration ? String(selectedDuration) : "45"}
                onValueChange={(val) =>
                  setValue("durationMinutes", Number(val), { shouldValidate: true })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger id="service-duration" className="h-11 rounded-xl">
                  <SelectValue placeholder="Duração" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.durationMinutes && (
                <p className="text-xs text-rose-600">{errors.durationMinutes.message}</p>
              )}
            </div>

            {/* Preço em CVE */}
            <div className="space-y-1.5">
              <label
                htmlFor="service-price"
                className="text-xs font-semibold text-slate-700"
              >
                Preço (CVE) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="service-price"
                  type="number"
                  step="50"
                  min="0"
                  placeholder="2000"
                  {...register("price")}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl pr-14"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                  CVE
                </span>
              </div>
              {errors.price && (
                <p className="text-xs text-rose-600">{errors.price.message}</p>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <label
              htmlFor="service-desc"
              className="text-xs font-semibold text-slate-700"
            >
              Descrição (opcional)
            </label>
            <textarea
              id="service-desc"
              rows={3}
              placeholder="Descreva detalhes como lavagem incluída, produtos utilizados, etc."
              {...register("description")}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 disabled:opacity-50 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-rose-600">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
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
              className="rounded-xl min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A guardar...
                </>
              ) : isEditing ? (
                "Guardar Alterações"
              ) : (
                "Criar Serviço"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

