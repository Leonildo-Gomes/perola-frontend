import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const scheduleBreakSchema = z
  .object({
    id: z.string().optional(),
    name: z
      .string()
      .min(1, "Identificação da pausa obrigatória (ex: Almoço)")
      .default("Almoço"),
    startTime: z.string().regex(timeRegex, "Formato de hora inválido (HH:mm)"),
    endTime: z.string().regex(timeRegex, "Formato de hora inválido (HH:mm)"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "A hora de fim da pausa deve ser posterior à hora de início",
    path: ["endTime"],
  });

export const scheduleDaySchema = z
  .object({
    id: z.string().optional(),
    dayOfWeek: z.enum([
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ]),
    isWorking: z.boolean(),
    startTime: z.string().nullable().optional(),
    endTime: z.string().nullable().optional(),
    breaks: z.array(scheduleBreakSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.isWorking) {
      if (!data.startTime || !timeRegex.test(data.startTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indique a hora de início de expediente",
          path: ["startTime"],
        });
      }
      if (!data.endTime || !timeRegex.test(data.endTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indique a hora de fim de expediente",
          path: ["endTime"],
        });
      }
      if (data.startTime && data.endTime && data.endTime <= data.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A hora de saída deve ser posterior à hora de entrada",
          path: ["endTime"],
        });
      }

      // Check breaks are within working hours
      if (data.startTime && data.endTime && data.breaks.length > 0) {
        data.breaks.forEach((b, idx) => {
          if (b.startTime < data.startTime! || b.endTime > data.endTime!) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `A pausa '${b.name}' deve estar contida dentro do horário de expediente (${data.startTime} - ${data.endTime})`,
              path: ["breaks", idx, "startTime"],
            });
          }
        });
      }
    }
  });

export const weeklyScheduleSchema = z.object({
  name: z.string().min(2, "O nome do perfil deve ter pelo menos 2 caracteres"),
  isDefault: z.boolean().default(false),
  days: z.array(scheduleDaySchema).min(1, "Configure pelo menos 1 dia"),
});

export const openMonthSchema = z.object({
  scheduleId: z.string().min(1, "Selecione o perfil de horário semanal"),
  year: z.number().int().min(2024, "Ano inválido"),
  month: z.number().int().min(1).max(12, "Mês inválido"),
  holidayDecisions: z
    .array(
      z.object({
        holidayDate: z.string(),
        workOnHoliday: z.boolean(),
      }),
    )
    .optional(),
});

export const createTimeOffSchema = z
  .object({
    type: z.enum(["VACATION", "SICK_LEAVE", "PERSONAL", "HOLIDAY", "OTHER"], {
      required_error: "Selecione o tipo de ausência",
    }),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de início inválida (AAAA-MM-DD)"),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de fim inválida (AAAA-MM-DD)"),
    isAllDay: z.boolean().default(true),
    startTime: z.string().nullable().optional(),
    endTime: z.string().nullable().optional(),
    note: z
      .string()
      .max(250, "A justificação não pode exceder 250 caracteres")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A data de fim deve ser igual ou posterior à data de início",
        path: ["endDate"],
      });
    }

    if (!data.isAllDay) {
      if (!data.startTime || !timeRegex.test(data.startTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indique a hora de início para ausência parcial",
          path: ["startTime"],
        });
      }
      if (!data.endTime || !timeRegex.test(data.endTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indique a hora de fim para ausência parcial",
          path: ["endTime"],
        });
      }
      if (data.startTime && data.endTime && data.endTime <= data.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A hora de saída deve ser posterior à hora de início",
          path: ["endTime"],
        });
      }
    }
  });

export type ScheduleBreakFormData = z.infer<typeof scheduleBreakSchema>;
export type ScheduleDayFormData = z.infer<typeof scheduleDaySchema>;
export type WeeklyScheduleFormData = z.infer<typeof weeklyScheduleSchema>;
export type OpenMonthFormData = z.infer<typeof openMonthSchema>;
export type CreateTimeOffFormData = z.infer<typeof createTimeOffSchema>;

