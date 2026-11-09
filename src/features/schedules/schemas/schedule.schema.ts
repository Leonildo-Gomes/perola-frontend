import { z } from "zod";
import { CV_PHONE_REGEX } from "@/lib/validations/auth";

export {
  cancelAppointmentSchema,
  type CancelAppointmentFormValues,
  rescheduleAppointmentSchema,
  type RescheduleAppointmentFormValues,
  reviewSchema,
  type ReviewFormValues,
} from "@/features/customers/schemas/customer.schema";

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

