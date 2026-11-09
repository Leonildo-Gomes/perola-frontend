"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ISLANDS, ISLAND_CITIES } from "@/lib/utils/geography";
import { useLocationStore } from "@/stores/location-store";

interface LocationSelectorProps {
  /** `stacked`: pin circle + two lines (mobile header). `inline`: single line (desktop search pill). */
  variant?: "stacked" | "inline";
}

export function LocationSelector({ variant = "inline" }: LocationSelectorProps) {
  const { island, city, setLocation } = useLocationStore();
  const [open, setOpen] = useState(false);
  const cities = island ? ISLAND_CITIES[island] ?? [] : [];
  const label = city && island ? `${city}, ${island}` : island ?? "Todas as ilhas";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "stacked" ? (
          <button
            type="button"
            aria-label={`Localização: ${label}. Alterar`}
            className="flex min-h-[44px] items-center gap-2.5 text-left"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-perola-mint text-perola-deep">
              <MapPin className="h-5 w-5" aria-hidden />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="flex items-center gap-1 text-base font-bold text-slate-900">
                <span className="truncate">{label}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
              </span>
              <span className="font-accent text-[10px] font-semibold uppercase tracking-[0.14em] text-perola-deep">
                Cabo Verde
              </span>
            </span>
          </button>
        ) : (
          <button
            type="button"
            aria-label={`Localização: ${label}. Alterar`}
            className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-full px-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            <MapPin className="h-5 w-5 text-perola-deep" aria-hidden />
            <span className="max-w-[10rem] truncate">{label}</span>
            <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden />
          </button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Onde estás?</DialogTitle>
          <DialogDescription>Escolhe a ilha e o concelho para ver salões perto de ti.</DialogDescription>
        </DialogHeader>
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
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => { setLocation(null, null); setOpen(false); }}>
              Limpar
            </Button>
            <Button variant="brand" className="flex-1" onClick={() => setOpen(false)}>
              Aplicar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
