import { queryOptions } from "@tanstack/react-query";
import { availabilityKeys } from "./availability.keys";
import {
  getHolidays,
  getMonthlySchedules,
  getWeeklySchedules,
  getTimeOffList,
} from "../api/availability.api";

export const availabilityQueries = {
  holidays: (currentYear: number) =>
    queryOptions({
      queryKey: availabilityKeys.holidayYear(currentYear),
      queryFn: async ({ signal }) => {
        const h1 = await getHolidays(currentYear, undefined, signal);
        const h2 = await getHolidays(currentYear + 1, undefined, signal);
        return [
          ...(Array.isArray(h1) ? h1 : []),
          ...(Array.isArray(h2) ? h2 : []),
        ];
      },
      staleTime: 120_000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }),

  monthlyByEmployee: (employeeId: string) =>
    queryOptions({
      queryKey: availabilityKeys.monthlyByEmployee(employeeId),
      queryFn: ({ signal }) => getMonthlySchedules(employeeId, signal),
      enabled: Boolean(employeeId),
      staleTime: 30_000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }),

  weeklyByEmployee: (employeeId: string) =>
    queryOptions({
      queryKey: availabilityKeys.weeklyByEmployee(employeeId),
      queryFn: ({ signal }) => getWeeklySchedules(employeeId, signal),
      enabled: Boolean(employeeId),
      staleTime: 30_000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }),

  timeOffByEmployee: (employeeId: string) =>
    queryOptions({
      queryKey: availabilityKeys.timeOffByEmployee(employeeId),
      queryFn: ({ signal }) => getTimeOffList(employeeId, signal),
      enabled: Boolean(employeeId),
      staleTime: 30_000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }),
};

