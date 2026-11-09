export const settingsKeys = {
  all: ["settings"] as const,
  business: () => [...settingsKeys.all, "business"] as const,
  businessDetail: (businessId: string) =>
    [...settingsKeys.business(), businessId] as const,
};

