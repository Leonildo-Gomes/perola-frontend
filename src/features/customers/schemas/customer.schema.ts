import { z } from "zod";

export const cancelAppointmentSchema = z.object({
  reason: z
    .string()
    .max(300, "O motivo não pode exceder 300 caracteres")
    .optional()
    .or(z.literal("")),
});

export type CancelAppointmentFormValues = z.infer<
  typeof cancelAppointmentSchema
>;

export const rescheduleAppointmentSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Selecione uma data válida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Selecione um horário válido"),
  reason: z
    .string()
    .max(300, "O motivo não pode exceder 300 caracteres")
    .optional()
    .or(z.literal("")),
});

export type RescheduleAppointmentFormValues = z.infer<
  typeof rescheduleAppointmentSchema
>;

export const reviewSchema = z.object({
  rating: z
    .number({ required_error: "Selecione uma pontuação de 1 a 5 estrelas" })
    .int()
    .min(1, "A avaliação mínima é 1 estrela")
    .max(5, "A avaliação máxima é 5 estrelas"),
  comment: z
    .string()
    .max(500, "O comentário não pode exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

