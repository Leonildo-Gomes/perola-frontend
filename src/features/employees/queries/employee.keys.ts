export const employeeKeys = {
  all: ["employees"] as const,

  lists: () => [...employeeKeys.all, "list"] as const,

  list: (businessId: string) => [...employeeKeys.lists(), businessId] as const,

  details: () => [...employeeKeys.all, "detail"] as const,

  detail: (businessId: string, employeeId: string) =>
    [...employeeKeys.details(), businessId, employeeId] as const,

  services: (businessId: string, employeeId: string) =>
    [...employeeKeys.detail(businessId, employeeId), "services"] as const,
};

