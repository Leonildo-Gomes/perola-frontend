import { z } from "zod";

export const NOTES_MAX_LENGTH = 500;

export const guestContactSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(150, "Nome não pode exceder 150 caracteres"),
  customerEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email para confirmação inválido"),
  customerPhone: z
    .string()
    .trim()
    .regex(
      /^[2359]\d{6}$/,
      "O telefone de Cabo Verde deve ter 7 dígitos e começar por 9, 5, 3 ou 2",
    ),
});

export const bookingFormSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(
      NOTES_MAX_LENGTH,
      `As notas não podem exceder ${NOTES_MAX_LENGTH} caracteres`,
    )
    .optional(),
  customerName: z.string().trim().max(150).optional(),
  customerEmail: z.string().trim().max(255).optional(),
  customerPhone: z.string().trim().max(20).optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
export type BookingNotesValues = BookingFormValues;
export const bookingNotesSchema = bookingFormSchema;
export type GuestContactValues = z.infer<typeof guestContactSchema>;
