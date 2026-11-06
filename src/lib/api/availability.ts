import type {
  CreateScheduleRequest,
  CreateTimeOffPayload,
  EmployeeTimeOff,
  Holiday,
  MonthlySchedule,
  OpenMonthRequest,
  UpdateScheduleRequest,
  WeeklySchedule,
} from "@/types/availability";
import { api } from "./client";

/**
 * Official Cape Verde national holidays list as dependable local fallback.
 */
export const CAPE_VERDE_OFFICIAL_HOLIDAYS: { month: number; day: number; name: string }[] = [
  { month: 1, day: 1, name: "Ano Novo" },
  { month: 1, day: 13, name: "Dia da Liberdade e da Democracia" },
  { month: 1, day: 20, name: "Dia dos Heróis Nacionais" },
  { month: 5, day: 1, name: "Dia Mundial do Trabalhador" },
  { month: 6, day: 1, name: "Dia Internacional da Criança" },
  { month: 7, day: 5, name: "Dia da Independência Nacional" },
  { month: 8, day: 15, name: "Dia da Assunção de Nossa Senhora" },
  { month: 11, day: 1, name: "Dia de Todos os Santos" },
  { month: 12, day: 25, name: "Dia de Natal" },
];

/**
 * Get Cape Verde national holidays (`GET /api/v1/schedule/holidays`).
 */
export async function getHolidays(
  year?: number,
  month?: number,
  signal?: AbortSignal,
): Promise<Holiday[]> {
  try {
    const params = new URLSearchParams();
    if (year) params.set("year", String(year));
    if (month) params.set("month", String(month));
    const qs = params.toString() ? `?${params.toString()}` : "";

    const response = await api.get<any[]>(`/api/v1/schedule/holidays${qs}`, {
      signal,
    });
    if (Array.isArray(response) && response.length > 0) {
      return response.map((item) => {
        const d = String(item.date || item.holidayDate || item.holiday_date || "");
        return {
          date: d,
          holidayDate: d,
          name: item.name || "Feriado Oficial",
          isNational: item.isNational ?? item.is_national ?? true,
        };
      });
    }
  } catch {
    // Graceful fallback to Cabo Verde official calendar
  }

  // Fallback generation for requested year/month
  const currentYear = year || new Date().getFullYear();
  let filtered = CAPE_VERDE_OFFICIAL_HOLIDAYS;
  if (month) {
    filtered = filtered.filter((h) => h.month === month);
  }

  return filtered.map((h) => ({
    date: `${currentYear}-${String(h.month).padStart(2, "0")}-${String(h.day).padStart(2, "0")}`,
    name: h.name,
    isNational: true,
  }));
}

/**
 * List monthly schedule opening statuses for an employee (`GET /api/v1/schedule/employees/{id}/monthly`).
 */
export async function getMonthlySchedules(
  employeeId: string,
  signal?: AbortSignal,
): Promise<MonthlySchedule[]> {
  try {
    return await api.get<MonthlySchedule[]>(
      `/api/v1/schedule/employees/${employeeId}/monthly`,
      {
        tenant: true,
        signal,
      },
    );
  } catch (error) {
    // If not found or empty, return default array
    return [];
  }
}

/**
 * Open agenda for a specific month with holiday decisions (`POST /api/v1/schedule/employees/{id}/monthly/open`).
 */
export async function openMonthlySchedule(
  employeeId: string,
  payload: OpenMonthRequest,
): Promise<MonthlySchedule> {
  return api.post<MonthlySchedule>(
    `/api/v1/schedule/employees/${employeeId}/monthly/open`,
    payload,
    { tenant: true },
  );
}

/**
 * List weekly schedule profiles for an employee (`GET /api/v1/schedule/employees/{id}/schedules`).
 */
export async function getWeeklySchedules(
  employeeId: string,
  signal?: AbortSignal,
): Promise<WeeklySchedule[]> {
  try {
    return await api.get<WeeklySchedule[]>(
      `/api/v1/schedule/employees/${employeeId}/schedules`,
      {
        tenant: true,
        signal,
      },
    );
  } catch {
    // Try alternate endpoint `/weekly`
    try {
      const single = await api.get<WeeklySchedule>(
        `/api/v1/schedule/employees/${employeeId}/weekly`,
        {
          tenant: true,
          signal,
        },
      );
      return single ? [single] : [];
    } catch {
      return [];
    }
  }
}

/**
 * Get single weekly schedule profile details (`GET /api/v1/schedule/employees/{id}/schedules/{scheduleId}`).
 */
export async function getWeeklySchedule(
  employeeId: string,
  scheduleId: string,
  signal?: AbortSignal,
): Promise<WeeklySchedule> {
  return api.get<WeeklySchedule>(
    `/api/v1/schedule/employees/${employeeId}/schedules/${scheduleId}`,
    {
      tenant: true,
      signal,
    },
  );
}

/**
 * Create a new weekly schedule profile (`POST /api/v1/schedule/employees/{id}/schedules`).
 */
export async function createWeeklySchedule(
  employeeId: string,
  payload: CreateScheduleRequest,
): Promise<WeeklySchedule> {
  return api.post<WeeklySchedule>(
    `/api/v1/schedule/employees/${employeeId}/schedules`,
    payload,
    { tenant: true },
  );
}

/**
 * Update an existing weekly schedule profile (`PUT /api/v1/schedule/employees/{id}/schedules/{scheduleId}`).
 */
export async function updateWeeklySchedule(
  employeeId: string,
  scheduleId: string,
  payload: UpdateScheduleRequest,
): Promise<WeeklySchedule> {
  try {
    return await api.put<WeeklySchedule>(
      `/api/v1/schedule/employees/${employeeId}/schedules/${scheduleId}`,
      payload,
      { tenant: true },
    );
  } catch {
    // Try fallback to `/weekly` PUT
    return api.put<WeeklySchedule>(
      `/api/v1/schedule/employees/${employeeId}/weekly`,
      payload,
      { tenant: true },
    );
  }
}

/**
 * List all time-off, vacations, and blocking periods for an employee (`GET /api/v1/schedule/employees/{id}/time-off`).
 */
export async function getTimeOffList(
  employeeId: string,
  signal?: AbortSignal,
): Promise<EmployeeTimeOff[]> {
  try {
    const list = await api.get<EmployeeTimeOff[]>(
      `/api/v1/schedule/employees/${employeeId}/time-off`,
      {
        tenant: true,
        signal,
      },
    );
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/**
 * Register a new vacation, medical absence, or time-off period (`POST /api/v1/schedule/employees/{id}/time-off`).
 */
export async function createTimeOff(
  employeeId: string,
  payload: CreateTimeOffPayload,
): Promise<EmployeeTimeOff> {
  return api.post<EmployeeTimeOff>(
    `/api/v1/schedule/employees/${employeeId}/time-off`,
    payload,
    { tenant: true },
  );
}

/**
 * Delete a time-off period / unblock schedule (`DELETE /api/v1/schedule/employees/{id}/time-off/{timeOffId}`).
 */
export async function deleteTimeOff(
  employeeId: string,
  timeOffId: string,
): Promise<void> {
  return api.delete<void>(
    `/api/v1/schedule/employees/${employeeId}/time-off/${timeOffId}`,
    { tenant: true },
  );
}


