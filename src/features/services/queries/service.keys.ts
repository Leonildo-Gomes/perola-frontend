export const serviceKeys = {
    all: ["services"] as const,

    lists: () =>
        [...serviceKeys.all, "list"] as const,

    list: (businessId: string) =>
        [...serviceKeys.lists(), businessId] as const,

    details: () =>
        [...serviceKeys.all, "detail"] as const,

    detail: (businessId: string, serviceId: string) =>
        [...serviceKeys.details(), businessId, serviceId] as const,
};