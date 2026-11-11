import { z } from "zod";

export const serviceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome do serviço deve ter pelo menos 2 caracteres")
    .max(100, "O nome do serviço não pode exceder 100 caracteres"),
  categoryId: z
    .string()
    .min(1, "Selecione uma categoria para o serviço")
    .uuid("Selecione uma categoria válida"),
  durationMinutes: z.coerce
    .number({ invalid_type_error: "Indique a duração em minutos" })
    .int("A duração deve ser um número inteiro")
    .min(5, "A duração mínima é de 5 minutos")
    .max(480, "A duração máxima é de 8 horas (480 minutos)")
    .refine(
      (val) => val % 5 === 0,
      "A duração deve ser um múltiplo de 5 minutos (ex: 15, 30, 45, 60)",
    ),
  price: z.coerce
    .number({ invalid_type_error: "Indique o preço do serviço" })
    .min(0, "O preço não pode ser negativo"),
  description: z
    .string()
    .max(500, "A descrição não pode ter mais de 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
