import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/atoms/Button";
import type { QuantitySelectorProps } from "./types";

export function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
  className,
}: QuantitySelectorProps) {
  const isAtMin = value <= min;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(isAtMin ? 0 : value - 1)}
        aria-label={isAtMin ? "Remover" : "Diminuir"}
        className="p-1"
      >
        {isAtMin ? <Trash2 size={16} /> : <Minus size={16} />}
      </Button>
      <span className="font-body font-semibold min-w-[2rem] text-center">
        {value}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(value + 1)}
        disabled={max !== undefined && value >= max}
        aria-label="Aumentar"
        className="p-1"
      >
        <Plus size={16} />
      </Button>
    </div>
  );
}
