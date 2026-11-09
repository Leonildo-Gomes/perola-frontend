import { z } from "zod";

export const searchBarSchema = z.object({
  query: z.string().trim().max(100, "O termo de pesquisa não pode exceder 100 caracteres").optional(),
});

export type SearchBarFormValues = z.infer<typeof searchBarSchema>;

export const marketplaceFiltersSchema = z.object({
  query: z.string().trim().max(100).optional(),
  category: z.string().nullable().optional(),
  island: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
});

export type MarketplaceFiltersValues = z.infer<typeof marketplaceFiltersSchema>;

