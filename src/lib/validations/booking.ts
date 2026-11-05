import { z } from "zod";

export const NOTES_MAX_LENGTH = 500;

export const bookingNotesSchema = z.object({
  notes: z.string().trim().max(NOTES_MAX_LENGTH, `As notas não podem exceder ${NOTES_MAX_LENGTH} caracteres`).optional(),
});
export type BookingNotesValues = z.infer<typeof bookingNotesSchema>;
