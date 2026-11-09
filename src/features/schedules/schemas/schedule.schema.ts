import { z } from "zod";
import { CV_PHONE_REGEX } from "@/lib/validations/auth";

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

export const newAppointmentFormSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "O nome do cliente deve ter pelo menos 2 caracteres")
    .max(120, "O nome não pode exceder 120 caracteres"),
  customerPhone: z
    .string()
    .trim()
    .regex(
      CV_PHONE_REGEX,
      "O número deve ter 7 dígitos e começar por 9, 5, 2 ou 3 (Cabo Verde)",
    ),
  employeeId: z.string().min(1, "Selecione o profissional que vai atender"),
  serviceId: z.string().min(1, "Selecione o serviço pretendido"),
  date: z.string().min(1, "Selecione a data de atendimento"),
  time: z.string().min(1, "Selecione a hora de início"),
  notes: z
    .string()
    .max(300, "Notas não podem ter mais de 300 caracteres")
    .optional()
    .or(z.literal("")),
});

export type NewAppointmentFormValues = z.infer<typeof newAppointmentFormSchema>;

