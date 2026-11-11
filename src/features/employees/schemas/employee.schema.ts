import { z } from "zod";
import { CV_PHONE_REGEX } from "@/features/auth/schemas/auth.schema";

export const employeeFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "O nome do colaborador deve ter pelo menos 2 caracteres")
    .max(120, "O nome não pode exceder 120 caracteres"),
  specialty: z
    .string()
    .trim()
    .min(2, "Indique a especialidade (ex: Cabeleireira, Barbeiro, Manicure)")
    .max(80, "A especialidade não pode exceder 80 caracteres"),
  accessRole: z.enum(["OWNER", "EMPLOYEE"]).default("EMPLOYEE"),
  phone: z
    .string()
    .trim()
    .regex(
      CV_PHONE_REGEX,
      "O número deve ter 7 dígitos e começar por 9, 5, 2 ou 3 (rede de Cabo Verde)",
    ),
  email: z
    .string()
    .trim()
    .email("Introduza um endereço de email válido")
    .optional()
    .or(z.literal("")),
  assignedServiceIds: z.array(z.string()).default([]),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
