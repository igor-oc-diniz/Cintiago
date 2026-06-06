import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";
import type { StarRatingProps } from "./types";

const sizeMap = { sm: 16, md: 24 };

export function StarRating({
  value,
  onChange,
  size = "md",
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const px = sizeMap[size];
  const isInteractive = Boolean(onChange);
  const display = hovered ?? value;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!isInteractive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => isInteractive && setHovered(star)}
          onMouseLeave={() => isInteractive && setHovered(null)}
          className={cn(
            "p-0.5 transition-colors",
            isInteractive ? "cursor-pointer" : "cursor-default",
          )}
          aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
        >
          <Star
            size={px}
            fill={
              star <= display
                ? "var(--color-tertiary-container)"
                : "transparent"
            }
            stroke={
              star <= display
                ? "var(--color-tertiary-container)"
                : "var(--color-outline)"
            }
          />
        </button>
      ))}
    </div>
  );
}
