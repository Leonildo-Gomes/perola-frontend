"use client";

import { useQuery } from "@tanstack/react-query";
import { employeeQueries } from "../queries/employee.queries";

export function useEmployees(businessId: string) {
  return useQuery(employeeQueries.list(businessId));
}

export function useEmployee(businessId: string, employeeId: string) {
  return useQuery(employeeQueries.detail(businessId, employeeId));
}

export function useEmployeeAssignedServices(
  businessId: string,
  employeeId: string,
) {
  return useQuery(employeeQueries.assignedServices(businessId, employeeId));
}

