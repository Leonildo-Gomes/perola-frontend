import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/** 1500 → "1.500 CVE" (Cape Verde escudo; no foreign currencies). */
export function formatCurrency(value: number): string {
  const [int, dec] = value.toFixed(2).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${grouped}${dec === "00" ? "" : `,${dec}`} CVE`;
}

/** 90 → "1h 30 min", 45 → "45 min". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m} min` : `${h}h`;
}
