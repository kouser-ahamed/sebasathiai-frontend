import type { AppointmentStatus } from "./types";

interface StatusBadgeProps {
  status: AppointmentStatus;
}

const classes = {
  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-400",
  approved:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/25 dark:text-blue-400",
  completed:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-400",
  rejected:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-400",
} as const;

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black capitalize ${classes[status]}`}>
    {status === "completed" ? "Complete Consultation" : status}
  </span>
);

export default StatusBadge;