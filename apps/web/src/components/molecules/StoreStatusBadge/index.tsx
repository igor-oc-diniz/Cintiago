import { cn } from "@/utils/cn";
import type { StoreStatusBadgeProps } from "./types";

export function StoreStatusBadge({
  isOpen,
  closesAt,
  opensAt,
  className,
}: StoreStatusBadgeProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          isOpen ? "bg-green-500" : "bg-[var(--color-error)]",
        )}
      />
      <span className="text-xs font-body text-[var(--color-on-surface-variant)]">
        {isOpen
          ? closesAt
            ? `Aberto até ${closesAt}`
            : "Aberto agora"
          : opensAt
            ? `Fechado · Abre às ${opensAt}`
            : "Fechado agora"}
      </span>
    </div>
  );
}
