export const availabilityKeys = {
  all: ["availability"] as const,

  holidays: () => [...availabilityKeys.all, "holidays"] as const,
  holidayYear: (year: number) => [...availabilityKeys.holidays(), year] as const,

  monthly: () => [...availabilityKeys.all, "monthly"] as const,
  monthlyByEmployee: (employeeId: string) =>
    [...availabilityKeys.monthly(), employeeId] as const,

  weekly: () => [...availabilityKeys.all, "weekly"] as const,
  weeklyByEmployee: (employeeId: string) =>
    [...availabilityKeys.weekly(), employeeId] as const,

  timeOff: () => [...availabilityKeys.all, "time-off"] as const,
  timeOffByEmployee: (employeeId: string) =>
    [...availabilityKeys.timeOff(), employeeId] as const,
};

