import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/types/booking";

const STYLES: Record<Exclude<AppointmentStatus, "RESCHEDULE_PENDING">, { label: string; className: string }> = {
  PENDING: { label: "Pendente", className: "border-status-pending-border bg-status-pending-bg text-status-pending-text" },
  CONFIRMED: { label: "Confirmada", className: "border-status-confirmed-border bg-status-confirmed-bg text-status-confirmed-text" },
  COMPLETED: { label: "Concluída", className: "border-status-completed-border bg-status-completed-bg text-status-completed-text" },
  CANCELLED: { label: "Cancelada", className: "border-status-cancelled-border bg-status-cancelled-bg text-status-cancelled-text" },
};

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
  /** Dashed border when a reschedule proposal is awaiting an answer. */
  hasPendingReschedule?: boolean;
  className?: string;
}

export function AppointmentStatusBadge({ status, hasPendingReschedule, className }: AppointmentStatusBadgeProps) {
  // RESCHEDULE_PENDING keeps the original (still valid) appointment status look: pending/amber.
  const key = status === "RESCHEDULE_PENDING" ? "PENDING" : status;
  const { label, className: tone } = STYLES[key];
  const pendingReschedule = hasPendingReschedule || status === "RESCHEDULE_PENDING";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-accent text-xs font-bold",
        tone,
        pendingReschedule && "border-dashed",
        className,
      )}
    >
      {status === "RESCHEDULE_PENDING" ? "Reagendamento pendente" : label}
    </span>
  );
}
