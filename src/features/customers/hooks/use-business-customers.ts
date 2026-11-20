"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getBusinessCustomerDetail,
  getBusinessCustomers,
  updateBusinessCustomer,
} from "../api/customer.api";
import { customerKeys } from "../queries/customer.keys";
import type {
  BusinessCustomersFilter,
  UpdateBusinessCustomerPayload,
} from "../types/customer.types";
import { scheduleKeys } from "@/features/schedules/queries/schedule.keys";

export function useBusinessCustomers(
  businessId: string | null | undefined,
  filter?: BusinessCustomersFilter,
) {
  return useQuery({
    queryKey: customerKeys.businessCustomers(businessId ?? "", filter),
    queryFn: ({ signal }) => getBusinessCustomers(businessId!, filter, signal),
    enabled: Boolean(businessId),
    staleTime: 30_000,
  });
}

export function useBusinessCustomerDetail(
  businessId: string | null | undefined,
  customerId: string | null | undefined,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: customerKeys.businessCustomerDetail(
      businessId ?? "",
      customerId ?? "",
    ),
    queryFn: ({ signal }) =>
      getBusinessCustomerDetail(businessId!, customerId!, signal),
    enabled: Boolean(businessId && customerId) && enabled,
    staleTime: 30_000,
  });
}

export function useUpdateBusinessCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      customerId,
      payload,
    }: {
      businessId: string;
      customerId: string;
      payload: UpdateBusinessCustomerPayload;
    }) => updateBusinessCustomer(businessId, customerId, payload),

    onSuccess: (updatedCustomer, vars) => {
      // Invalidate customer lists and details
      void queryClient.invalidateQueries({
        queryKey: ["business-customers", vars.businessId],
      });
      void queryClient.invalidateQueries({
        queryKey: customerKeys.businessCustomerDetail(
          vars.businessId,
          vars.customerId,
        ),
      });
      // Invalidate schedule appointments so badges and notes update immediately
      void queryClient.invalidateQueries({
        queryKey: scheduleKeys.all,
      });

      toast.success("Classificação e notas atualizadas com sucesso!");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a ficha do cliente. Tente novamente.",
      );
    },
  });
}
