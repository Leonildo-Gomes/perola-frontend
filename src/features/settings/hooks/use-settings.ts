"use client";

import { useQuery } from "@tanstack/react-query";
import { settingsQueries } from "../queries/settings.queries";

export function useBusinessSettings(businessId: string) {
  return useQuery(settingsQueries.business(businessId));
}

