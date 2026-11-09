export const bookingKeys = {
  all: ["booking"] as const,

  target: (serviceId: string, businessIdHint?: string | null) =>
    [...bookingKeys.all, "target", serviceId, businessIdHint] as const,

  slots: (serviceId: string, employeeId: string, date: string) =>
    ["slots", { serviceId, employeeId, date }] as const,

  nextAvailable: (serviceId: string, employeeIds: string[], from: string) =>
    ["slots", "next-available", { serviceId, employeeIds, from }] as const,

  appointment: (appointmentId: string) =>
    ["appointments", "detail", appointmentId] as const,

  businessProfile: (businessId: string) =>
    ["marketplace", "business", businessId] as const,
};

