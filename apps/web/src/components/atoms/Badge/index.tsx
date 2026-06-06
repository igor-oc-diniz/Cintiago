import { cn } from "@/utils/cn";
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from "@/utils/format";
import type { BadgeProps } from "./types";

const extraColors: Record<string, string> = {
  vegetarian:
    "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]",
  new: "bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed-variant)]",
  spicy: "bg-amber-100 text-amber-800",
};

const extraLabels: Record<string, string> = {
  vegetarian: "Vegetariana",
  new: "Novidade",
  spicy: "Picante",
};

export function Badge({ variant, className, children }: BadgeProps) {
  const colorClass = ORDER_STATUS_COLOR[variant] ?? extraColors[variant] ?? "";
  const label =
    children ?? ORDER_STATUS_LABEL[variant] ?? extraLabels[variant] ?? variant;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-body",
        colorClass,
        className,
      )}
    >
      {label}
    </span>
  );
}
