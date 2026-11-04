import { z } from "zod";

/** Cape Verde numbers: 7 digits starting with 9, 5, 2 or 3 (dial code +238 is fixed). */
export const CV_PHONE_REGEX = /^[9532]\d{6}$/;

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Introduza o seu email").email("Introduza um endereço de email válido"),
  password: z.string().min(8, "A palavra-passe deve ter pelo menos 8 caracteres"),
  rememberMe: z.boolean().optional(),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  intent: z.enum(["CUSTOMER", "BUSINESS_OWNER"]),
  name: z.string().trim().min(2, "Introduza o seu nome completo").max(120, "Nome demasiado longo"),
  email: z.string().trim().min(1, "Introduza o seu email").email("Introduza um endereço de email válido"),
  /** National 7 digits, without the +238 prefix and without spaces. */
  phone: z
    .string()
    .regex(
      CV_PHONE_REGEX,
      "O número deve ter 7 dígitos e começar por 9, 5, 2 ou 3 (rede válida em Cabo Verde)",
    ),
  password: z
    .string()
    .min(8, "A palavra-passe deve ter pelo menos 8 caracteres")
    .regex(/[A-Za-z]/, "Inclua pelo menos uma letra")
    .regex(/\d/, "Inclua pelo menos um número"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Tem de aceitar os Termos de Utilização" }),
  }),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type UserIntent = RegisterFormValues["intent"];

/** 0–4 password strength (length, case mix, digit, symbol). */
export function passwordStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++;
  return score;
}
