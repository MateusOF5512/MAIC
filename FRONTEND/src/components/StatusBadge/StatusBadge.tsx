import type { InfrastructureStatus } from "@/types/infrastructure";
import { STATUS_BG_CLASSES, STATUS_LABELS } from "@/utils/status";
import { cn } from "@/utils/cn";

interface StatusBadgeProps {
  status: InfrastructureStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_BG_CLASSES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
