import { z } from "zod";
import { ISLANDS } from "@/lib/geography";
import { CV_PHONE_REGEX } from "./auth";

export const createBusinessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome do salão deve ter pelo menos 2 caracteres")
    .max(100, "O nome do salão não pode exceder 100 caracteres"),
  island: z
    .string()
    .min(1, "Selecione a ilha do estabelecimento")
    .refine((val) => ISLANDS.includes(val), "Selecione uma ilha válida de Cabo Verde"),
  city: z
    .string()
    .trim()
    .min(2, "Selecione o concelho ou cidade"),
  location: z
    .string()
    .trim()
    .min(3, "Introduza a morada ou referência de localização")
    .max(200, "A morada não pode exceder 200 caracteres"),
  phone: z
    .string()
    .regex(
      CV_PHONE_REGEX,
      "O número deve ter 7 dígitos e começar por 9, 5, 2 ou 3 (rede de Cabo Verde)",
    ),
});

export const updateBusinessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome do salão deve ter pelo menos 2 caracteres")
    .max(100, "O nome do salão não pode exceder 100 caracteres"),
  island: z
    .string()
    .min(1, "Selecione a ilha do estabelecimento")
    .refine((val) => ISLANDS.includes(val), "Selecione uma ilha válida de Cabo Verde"),
  city: z
    .string()
    .trim()
    .min(2, "Selecione o concelho ou cidade"),
  location: z
    .string()
    .trim()
    .min(3, "Introduza a morada ou referência de localização")
    .max(200, "A morada não pode exceder 200 caracteres"),
  phone: z
    .string()
    .regex(
      CV_PHONE_REGEX,
      "O número deve ter 7 dígitos e começar por 9, 5, 2 ou 3 (rede de Cabo Verde)",
    ),
  isActive: z.boolean().default(true),
});

export type CreateBusinessFormValues = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessFormValues = z.infer<typeof updateBusinessSchema>;
