import type { CSSProperties } from "react";
import { cn } from "@/utils/cn";

interface DividerProps {
  className?: string;
  style?: CSSProperties;
}

export function Divider({ className, style }: DividerProps) {
  const isBamboo = className?.includes("bamboo");

  if (isBamboo) {
    return (
      <div
        className={cn(
          "h-6 bg-[var(--color-surface-high)] border-y border-[var(--color-bamboo-accent)]",
          className,
        )}
        style={{ backgroundImage: "var(--texture-bamboo-slats)", ...style }}
      />
    );
  }

  return (
    <hr
      className={cn(
        "border-0 border-t border-[var(--color-outline-variant)]",
        className,
      )}
      style={style}
    />
  );
}
