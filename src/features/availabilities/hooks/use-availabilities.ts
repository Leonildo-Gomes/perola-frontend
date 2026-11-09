"use client";

import { useQuery } from "@tanstack/react-query";
import { availabilityQueries } from "../queries/availability.queries";

export function useHolidays(year: number = new Date().getFullYear()) {
  return useQuery(availabilityQueries.holidays(year));
}

export function useMonthlySchedules(employeeId: string) {
  return useQuery(availabilityQueries.monthlyByEmployee(employeeId));
}

export function useWeeklySchedules(employeeId: string) {
  return useQuery(availabilityQueries.weeklyByEmployee(employeeId));
}

export function useTimeOffList(employeeId: string) {
  return useQuery(availabilityQueries.timeOffByEmployee(employeeId));
}

