import { cn } from "@/utils/cn";
import type { TagProps } from "./types";

export function Tag({ label, active = false, onClick, className }: TagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-body font-medium cursor-pointer transition-colors border",
        active
          ? "bg-[var(--color-primary)] text-white border-transparent"
          : "border-[var(--color-outline-variant)] bg-transparent text-[var(--color-on-surface)]",
        className,
      )}
    >
      {label}
    </button>
  );
}
