import { queryOptions } from "@tanstack/react-query";
import { employeeKeys } from "./employee.keys";
import {
  getEmployees,
  getEmployee,
  getEmployeeAssignedServices,
} from "../api/employee.api";

export const employeeQueries = {
  list: (businessId: string) =>
    queryOptions({
      queryKey: employeeKeys.list(businessId),
      queryFn: ({ signal }) => getEmployees(businessId, signal),
      enabled: Boolean(businessId),
      staleTime: 60_000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }),

  detail: (businessId: string, employeeId: string) =>
    queryOptions({
      queryKey: employeeKeys.detail(businessId, employeeId),
      queryFn: ({ signal }) => getEmployee(businessId, employeeId, signal),
      enabled: Boolean(businessId) && Boolean(employeeId),
      staleTime: 60_000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }),

  assignedServices: (businessId: string, employeeId: string) =>
    queryOptions({
      queryKey: employeeKeys.services(businessId, employeeId),
      queryFn: ({ signal }) =>
        getEmployeeAssignedServices(businessId, employeeId, signal),
      enabled: Boolean(businessId) && Boolean(employeeId),
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    }),
};

