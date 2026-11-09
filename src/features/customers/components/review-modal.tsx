"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { submitReview } from "../api/customer.api";
import { type ReviewFormValues, reviewSchema } from "../schemas/customer.schema";
import type { CustomerAppointment } from "../types/customer.types";

interface ReviewModalProps {
  appointment: CustomerAppointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ appointment, isOpen, onClose }: ReviewModalProps) {
  const queryClient = useQueryClient();
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const currentRating = watch("rating");

  const mutation = useMutation({
    mutationFn: (data: ReviewFormValues) => {
      if (!appointment) throw new Error("Nenhuma marcação selecionada");
      return submitReview(appointment.id, {
        rating: data.rating,
        comment: data.comment || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Obrigado pela sua avaliação!");
      void queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      reset();
      onClose();
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Não foi possível submeter a avaliação. Tente novamente.",
      );
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Star className="h-6 w-6 fill-amber-500" aria-hidden />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-slate-900">
            Avaliar Atendimento
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-slate-600">
            Como correu o seu atendimento de{" "}
            <span className="font-semibold text-slate-900">{appointment.serviceName}</span>{" "}
            com <span className="font-semibold text-slate-900">{appointment.employeeName}</span> no{" "}
            <span className="font-semibold text-slate-900">{appointment.businessName}</span>?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 py-2">
          {/* Star selector */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Pontuação por estrelas">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating ?? currentRating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={currentRating === star}
                    aria-label={`${star} ${star === 1 ? "estrela" : "estrelas"}`}
                    className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setValue("rating", star, { shouldValidate: true })}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        isFilled
                          ? "fill-amber-400 text-amber-500 drop-shadow-sm"
                          : "text-slate-300 hover:text-amber-200"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-semibold text-amber-700">
              {currentRating === 5 && "Excelente! Cinco estrelas"}
              {currentRating === 4 && "Muito bom"}
              {currentRating === 3 && "Bom"}
              {currentRating === 2 && "Razoável"}
              {currentRating === 1 && "Precisa de melhorias"}
            </p>
            {errors.rating?.message && (
              <p className="text-xs text-rose-600">{errors.rating.message}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="review-comment" className="block text-xs font-semibold text-slate-700 mb-1">
              Partilhe a sua experiência (opcional)
            </label>
            <textarea
              id="review-comment"
              rows={3}
              placeholder="O que achou da pontualidade, simpatia e qualidade do resultado?"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-perola-deep focus:outline-none focus:ring-2 focus:ring-perola-deep/20"
              {...register("comment")}
            />
            {errors.comment?.message && (
              <p className="mt-1 text-xs text-rose-600">{errors.comment.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="brand"
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A submeter...
                </>
              ) : (
                "Submeter Avaliação"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

