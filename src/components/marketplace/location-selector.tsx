"use client";

import { MapPin } from "lucide-react";
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
import { ISLANDS, ISLAND_CITIES } from "@/lib/geography";
import { useLocationStore } from "@/stores/location-store";

export function LocationSelector() {
  const { island, city, setLocation } = useLocationStore();
  const [open, setOpen] = useState(false);
  const cities = island ? ISLAND_CITIES[island] ?? [] : [];
  const label = city ? `${city}` : island ?? "Toda a Cabo Verde";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="max-w-[10rem] gap-1.5 px-3 sm:max-w-none" aria-label={`Localização: ${label}. Alterar`}>
          <MapPin className="h-4 w-4 shrink-0 text-teal-600" aria-hidden />
          <span className="truncate">{label}</span>
        </Button>
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
            <Button className="flex-1" onClick={() => setOpen(false)}>
              Aplicar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
