export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface Holiday {
  date: string; // YYYY-MM-DD
  holidayDate?: string; // DTO alias compatibility (Spring Boot backend)
  name: string;
  isNational?: boolean;
}

export interface HolidayDecision {
  holidayDate: string; // YYYY-MM-DD
  workOnHoliday: boolean;
}

export interface MonthlySchedule {
  id: string;
  employeeId: string;
  scheduleId: string;
  scheduleName: string;
  year: number;
  month: number; // 1-12
  isOpened: boolean;
  openedAt?: string | null;
  workingDaysCount?: number;
  totalHoursCount?: number;
}

export interface OpenMonthRequest {
  scheduleId: string;
  year: number;
  month: number;
  holidayDecisions?: HolidayDecision[];
}

export interface ScheduleBreak {
  id?: string;
  name: string; // e.g. "Almoço"
  startTime: string; // HH:mm (e.g. "12:30")
  endTime: string; // HH:mm (e.g. "13:30")
}

export interface ScheduleDay {
  id?: string;
  dayOfWeek: DayOfWeek;
  isWorking: boolean;
  startTime?: string | null; // HH:mm (e.g. "08:00")
  endTime?: string | null; // HH:mm (e.g. "18:00")
  breaks: ScheduleBreak[];
}

export interface WeeklySchedule {
  id: string;
  employeeId: string;
  name: string; // e.g. "Horário Padrão"
  isDefault: boolean;
  days: ScheduleDay[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateScheduleRequest {
  name: string;
  isDefault?: boolean;
  days: ScheduleDay[];
}

export interface UpdateScheduleRequest {
  name?: string;
  isDefault?: boolean;
  days: ScheduleDay[];
}

export const DAY_OF_WEEK_LABELS: Record<
  DayOfWeek,
  { short: string; full: string; order: number }
> = {
  MONDAY: { short: "Seg", full: "Segunda-feira", order: 1 },
  TUESDAY: { short: "Ter", full: "Terça-feira", order: 2 },
  WEDNESDAY: { short: "Qua", full: "Quarta-feira", order: 3 },
  THURSDAY: { short: "Qui", full: "Quinta-feira", order: 4 },
  FRIDAY: { short: "Sex", full: "Sexta-feira", order: 5 },
  SATURDAY: { short: "Sáb", full: "Sábado", order: 6 },
  SUNDAY: { short: "Dom", full: "Domingo", order: 7 },
};

export const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export type TimeOffType =
  | "VACATION"
  | "SICK_LEAVE"
  | "PERSONAL"
  | "HOLIDAY"
  | "OTHER";

export interface EmployeeTimeOff {
  id: string;
  employeeId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isAllDay: boolean;
  startTime?: string | null; // HH:mm
  endTime?: string | null; // HH:mm
  type: TimeOffType;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTimeOffPayload {
  startDate: string;
  endDate: string;
  isAllDay: boolean;
  startTime?: string | null;
  endTime?: string | null;
  type: TimeOffType;
  note?: string;
}

export const TIME_OFF_TYPE_CONFIG: Record<
  TimeOffType,
  { label: string; badgeClasses: string; description: string }
> = {
  VACATION: {
    label: "Férias Anuais",
    badgeClasses: "bg-teal-50 text-teal-800 border-teal-200",
    description: "Período de descanso e férias anuais",
  },
  SICK_LEAVE: {
    label: "Atestado Médico / Saúde",
    badgeClasses: "bg-rose-50 text-rose-800 border-rose-200",
    description: "Consulta médica ou baixa de saúde",
  },
  PERSONAL: {
    label: "Assunto Pessoal",
    badgeClasses: "bg-amber-50 text-amber-800 border-amber-200",
    description: "Compromisso pessoal ou folga solicitada",
  },
  HOLIDAY: {
    label: "Feriado / Ponte",
    badgeClasses: "bg-sky-50 text-sky-800 border-sky-200",
    description: "Feriado oficial ou tolerância de ponto",
  },
  OTHER: {
    label: "Outro Bloqueio",
    badgeClasses: "bg-slate-100 text-slate-700 border-slate-200",
    description: "Outro motivo de indisponibilidade da agenda",
  },
};

