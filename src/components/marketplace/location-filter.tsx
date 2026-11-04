"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ISLANDS, ISLAND_CITIES } from "@/lib/geography";
import { useLocationStore } from "@/stores/location-store";

/** Island → Concelho/City chained selects bound to the location store. */
export function LocationFilter() {
  const { island, city, setLocation } = useLocationStore();
  const cities = island ? ISLAND_CITIES[island] ?? [] : [];
  return (
    <div className="flex flex-col gap-3">
      <Select value={island ?? undefined} onValueChange={(v) => setLocation(v, null)}>
        <SelectTrigger aria-label="Ilha">
          <SelectValue placeholder="Ilha" />
        </SelectTrigger>
        <SelectContent>
          {ISLANDS.map((i) => (
            <SelectItem key={i} value={i}>
              {i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={city ?? undefined} onValueChange={(v) => setLocation(island, v)} disabled={!island}>
        <SelectTrigger aria-label="Concelho ou cidade">
          <SelectValue placeholder="Concelho / Cidade" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
