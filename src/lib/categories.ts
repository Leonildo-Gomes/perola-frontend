export interface ServiceCategory {
  slug: string;
  label: string;
}

/** Marketplace categories (Stitch "Marketplace" pills). */
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { slug: "cabelos", label: "Cabelos" },
  { slug: "unhas", label: "Unhas" },
  { slug: "barbearia", label: "Barbearia" },
  { slug: "massagens-spa", label: "Massagens & Spa" },
  { slug: "estetica-facial", label: "Estética Facial" },
  { slug: "depilacao", label: "Depilação" },
  { slug: "maquilhagem", label: "Maquilhagem" },
];
