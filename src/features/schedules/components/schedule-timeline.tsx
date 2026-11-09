"use client";

import { useEffect, useState } from "react";
import { Coffee, Plus, Sparkles, User } from "lucide-react";
import { cvDateKey, formatTime } from "@/lib/datetime";
import { cn, formatCurrency } from "@/lib/utils";
import type { SalonAppointment } from "../types/schedule.types";
import type { Employee } from "@/features/employees/types/employee.types";
import { AppointmentBlock } from "./appointment-block";

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const HOUR_HEIGHT = 80; // px per hour

interface ScheduleTimelineProps {
  dateKey: string;
  appointments: SalonAppointment[];
  employees: Employee[];
  selectedEmployeeId?: string;
  onConfirmAppointment: (appointment: SalonAppointment) => void;
  onCompleteAppointment: (appointment: SalonAppointment) => void;
  onCancelAppointment: (appointment: SalonAppointment) => void;
  onAcceptReschedule: (appointment: SalonAppointment) => void;
  onRejectReschedule: (appointment: SalonAppointment) => void;
  onNewAppointmentAt?: (timeString: string, employeeId?: string) => void;
  isPendingAction?: boolean;
}

export function ScheduleTimeline({
  dateKey,
  appointments,
  employees,
  selectedEmployeeId,
  onConfirmAppointment,
  onCompleteAppointment,
  onCancelAppointment,
  onAcceptReschedule,
  onRejectReschedule,
  onNewAppointmentAt,
  isPendingAction = false,
}: ScheduleTimelineProps) {
  const isToday = dateKey === cvDateKey();

  // Current live time indicator
  const [currentMinutesFrom8am, setCurrentMinutesFrom8am] = useState<number | null>(null);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState<string>("");

  useEffect(() => {
    if (!isToday) {
      setCurrentMinutesFrom8am(null);
      return;
    }

    const updateLiveTime = () => {
      // Cape Verde is UTC-1 (60 minutes behind UTC)
      const now = new Date();
      const cvHours = (now.getUTCHours() - 1 + 24) % 24;
      const cvMinutes = now.getUTCMinutes();

      setCurrentTimeFormatted(
        `${String(cvHours).padStart(2, "0")}:${String(cvMinutes).padStart(2, "0")}`,
      );

      if (cvHours >= 8 && cvHours < 19) {
        const totalMinutes = (cvHours - 8) * 60 + cvMinutes;
        setCurrentMinutesFrom8am(totalMinutes);
      } else {
        setCurrentMinutesFrom8am(null);
      }
    };

    updateLiveTime();
    const interval = setInterval(updateLiveTime, 60_000);
    return () => clearInterval(interval);
  }, [isToday]);

  // Determine active specialists to display
  const activeEmployees = employees.length > 0 ? employees.filter((e) => e.isActive) : [];
  const displayedEmployees = selectedEmployeeId && selectedEmployeeId !== "ALL"
    ? activeEmployees.filter((e) => e.id === selectedEmployeeId)
    : activeEmployees;

  // Group appointments by employee
  const getAppointmentsForEmployee = (employeeId: string) => {
    return appointments.filter((a) => a.employeeId === employeeId);
  };

  // Calculate position for an appointment
  const getAppointmentOffset = (startTimeIso: string, durationMinutes: number) => {
    try {
      const d = new Date(startTimeIso);
      const cvHours = (d.getUTCHours() - 1 + 24) % 24;
      const cvMinutes = d.getUTCMinutes();
      const minutesFrom8 = (cvHours - 8) * 60 + cvMinutes;
      const top = Math.max(0, (minutesFrom8 / 60) * HOUR_HEIGHT);
      const height = Math.max(50, (durationMinutes / 60) * HOUR_HEIGHT - 6);
      return { top, height };
    } catch {
      return { top: 0, height: 60 };
    }
  };

  const totalTimelineHeight = (HOURS.length - 1) * HOUR_HEIGHT;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
      {/* ========================================================================= */}
      {/* 1. Mobile Chronological View (< lg)                                       */}
      {/* ========================================================================= */}
      <div className="lg:hidden p-4 space-y-4">
        {appointments.length === 0 ? (
          <div className="py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 mx-auto mb-3">
              <Sparkles className="h-6 w-6" />
            </span>
            <p className="text-sm font-semibold text-slate-800">
              Sem marcações para esta data
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Nenhum agendamento registado para este dia. Toque em Novo Agendamento para marcar.
            </p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <AppointmentBlock
              key={appointment.id}
              appointment={appointment}
              onConfirm={onConfirmAppointment}
              onComplete={onCompleteAppointment}
              onCancel={onCancelAppointment}
              onAcceptReschedule={onAcceptReschedule}
              onRejectReschedule={onRejectReschedule}
              isPendingAction={isPendingAction}
            />
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. Desktop Multi-Column Grid (>= lg)                                     */}
      {/* ========================================================================= */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row: Column for Time + Columns for each Employee */}
          <div
            className="grid border-b border-slate-200 bg-slate-50/80 sticky top-16 z-20"
            style={{
              gridTemplateColumns: `80px repeat(${Math.max(1, displayedEmployees.length)}, minmax(240px, 1fr))`,
            }}
          >
            {/* Time Axis Header */}
            <div className="p-3.5 flex items-center justify-center border-r border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
              Horário
            </div>

            {/* Specialist Headers */}
            {displayedEmployees.map((emp) => {
              const empAppointments = getAppointmentsForEmployee(emp.id);
              const dailyTotal = empAppointments.reduce(
                (sum, a) => sum + (a.status !== "CANCELLED" ? a.servicePrice : 0),
                0,
              );

              return (
                <div
                  key={emp.id}
                  className="p-3.5 border-r border-slate-200 flex items-center justify-between gap-3 bg-white"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-xs font-bold ring-2 ring-teal-600/20">
                      {emp.displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm truncate">
                          {emp.displayName}
                        </span>
                        {emp.isOwner && (
                          <span className="rounded bg-teal-50 text-teal-700 px-1.5 py-0.2 text-[9px] font-bold uppercase border border-teal-200">
                            CHEFE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {emp.role || "Especialista"} • {empAppointments.length} marcações
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-teal-700 font-price block">
                      {formatCurrency(dailyTotal)}
                    </span>
                    <span className="text-[10px] text-slate-400">faturação dia</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline Grid Body */}
          <div
            className="relative grid select-none"
            style={{
              height: `${totalTimelineHeight}px`,
              gridTemplateColumns: `80px repeat(${Math.max(1, displayedEmployees.length)}, minmax(240px, 1fr))`,
            }}
          >
            {/* Hour Markers (Left Axis) */}
            <div className="border-r border-slate-200 bg-slate-50/50 flex flex-col">
              {HOURS.slice(0, -1).map((h) => (
                <div
                  key={h}
                  style={{ height: `${HOUR_HEIGHT}px` }}
                  className="border-b border-slate-100 flex items-start justify-center pt-2 text-xs font-semibold text-slate-400"
                >
                  {String(h).padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* Horizontal Grid Rows across all columns */}
            <div
              className="absolute left-[80px] right-0 top-0 bottom-0 pointer-events-none flex flex-col"
              style={{ height: `${totalTimelineHeight}px` }}
            >
              {HOURS.slice(0, -1).map((h) => (
                <div
                  key={h}
                  style={{ height: `${HOUR_HEIGHT}px` }}
                  className="border-b border-slate-100/80"
                />
              ))}
            </div>

            {/* LIVE TIME INDICATOR LINE (if today and within 08:00 - 18:00) */}
            {currentMinutesFrom8am !== null && (
              <div
                className="absolute left-0 right-0 z-30 pointer-events-none flex items-center"
                style={{
                  top: `${(currentMinutesFrom8am / 60) * HOUR_HEIGHT}px`,
                }}
              >
                <div className="w-[80px] flex justify-end pr-2">
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    {currentTimeFormatted}
                  </span>
                </div>
                <div className="flex-1 h-[2px] bg-rose-500 relative">
                  <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                </div>
              </div>
            )}

            {/* Columns for each employee */}
            {displayedEmployees.map((emp) => {
              const empAppointments = getAppointmentsForEmployee(emp.id);

              return (
                <div
                  key={emp.id}
                  className="relative border-r border-slate-200 p-2"
                  style={{ height: `${totalTimelineHeight}px` }}
                >
                  {/* Lunch break card representation (13:00 - 14:00) */}
                  <div
                    className="absolute left-2 right-2 rounded-xl bg-slate-100/80 border-2 border-dashed border-slate-200 flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold"
                    style={{
                      top: `${5 * HOUR_HEIGHT}px`, // 13:00 is 5 hours from 08:00
                      height: `${HOUR_HEIGHT}px`,
                    }}
                  >
                    <Coffee className="h-4 w-4" />
                    <span>Pausa de Almoço (13:00 - 14:00)</span>
                  </div>

                  {/* Render Appointments */}
                  {empAppointments.map((appointment) => {
                    const { top, height } = getAppointmentOffset(
                      appointment.startTime,
                      appointment.serviceDuration,
                    );

                    return (
                      <div
                        key={appointment.id}
                        className="absolute left-2 right-2 z-10 transition-transform hover:z-20"
                        style={{
                          top: `${top}px`,
                          minHeight: `${height}px`,
                        }}
                      >
                        <AppointmentBlock
                          appointment={appointment}
                          onConfirm={onConfirmAppointment}
                          onComplete={onCompleteAppointment}
                          onCancel={onCancelAppointment}
                          onAcceptReschedule={onAcceptReschedule}
                          onRejectReschedule={onRejectReschedule}
                          isPendingAction={isPendingAction}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

