"use client";

import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { getSlots } from "../api/booking.api";
import { bookingKeys } from "../queries/booking.keys";
import { formatTime } from "@/lib/datetime";
import type { SlotItem } from "../types/booking.types";

/** Anti-overbooking freshness: slots are stale after 10s. */
export const SLOTS_STALE_MS = 10_000;

export const slotsKey = (serviceId: string, employeeId: string, date: string) =>
  bookingKeys.slots(serviceId, employeeId, date);

export interface UseSlotsParams {
  businessId: string;
  serviceId: string;
  /** Professionals to query (one for a specific choice, all for "any"). */
  employeeIds: string[];
  date: string;
  enabled?: boolean;
}

/** Slot options for a date, merged across professionals (first professional wins on equal start). */
export function useSlots({ businessId, serviceId, employeeIds, date, enabled = true }: UseSlotsParams) {
  const results = useQueries({
    queries: employeeIds.map((employeeId) => ({
      queryKey: slotsKey(serviceId, employeeId, date),
      queryFn: ({ signal }: { signal: AbortSignal }) => getSlots({ businessId, employeeId, serviceId, date }, signal),
      staleTime: SLOTS_STALE_MS,
      enabled,
    })),
  });

  const dataKey = results.map((r) => r.dataUpdatedAt).join(",");
  const slots = useMemo<SlotItem[]>(() => {
    const now = Date.now();
    const byStart = new Map<string, SlotItem>();
    results.forEach((r, i) => {
      for (const s of r.data?.slots ?? []) {
        if (new Date(s.startTime).getTime() <= now || byStart.has(s.startTime)) continue;
        byStart.set(s.startTime, {
          startTime: s.startTime,
          formattedTime: formatTime(s.startTime),
          available: true,
          employeeId: employeeIds[i],
        });
      }
    });
    return [...byStart.values()].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey, employeeIds.join(",")]);

  return {
    slots,
    isLoading: enabled && results.some((r) => r.isPending),
    isError: results.length > 0 && results.every((r) => r.isError),
    isFetching: results.some((r) => r.isFetching),
    refetch: () => Promise.all(results.map((r) => r.refetch())),
  };
}

/** Invalidates every slot query (also the "next available" probes). */
export function useInvalidateSlots() {
  const qc = useQueryClient();
  return useCallback(() => qc.invalidateQueries({ queryKey: ["slots"] }), [qc]);
}

/**
 * First date after `from` (within `dates`) that has at least one free future slot.
 * Only runs when `enabled` (the selected day is empty). Shares the cache with `useSlots`.
 */
export function useNextAvailableDate({
  businessId,
  serviceId,
  employeeIds,
  dates,
  from,
  enabled,
}: Omit<UseSlotsParams, "date" | "enabled"> & { dates: string[]; from: string; enabled: boolean }) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: bookingKeys.nextAvailable(serviceId, employeeIds, from),
    enabled,
    staleTime: SLOTS_STALE_MS,
    queryFn: async ({ signal }) => {
      const now = Date.now();
      for (const date of dates.slice(dates.indexOf(from) + 1)) {
        const days = await Promise.all(
          employeeIds.map((employeeId) =>
            qc.fetchQuery({
              queryKey: slotsKey(serviceId, employeeId, date),
              queryFn: () => getSlots({ businessId, employeeId, serviceId, date }, signal),
              staleTime: SLOTS_STALE_MS,
            }),
          ),
        );
        if (days.some((d) => d.slots.some((s) => new Date(s.startTime).getTime() > now))) return date;
      }
      return null;
    },
  });
}

