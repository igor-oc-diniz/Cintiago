import { formatPrice } from "@/utils/format";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import type { Pizza } from "@/types/domain";

export const SIZE_LABELS: Record<string, string> = {
  small: "Pequena",
  medium: "Média",
  large: "Grande",
};

export const SIZE_DESC: Record<string, string> = {
  small: "4 fatias · 25cm",
  medium: "6 fatias · 30cm",
  large: "8 fatias · 35cm",
};

export const SIZE_ORDER = ["small", "medium", "large"] as const;

type PizzaSize = "small" | "medium" | "large";

interface SizeSelectorProps {
  pizza: Pizza;
  secondPizza?: Pizza | null;
  isMeia: boolean;
  selectedSize: PizzaSize;
  onSelect: (size: PizzaSize) => void;
}

export function SizeSelector({
  pizza,
  secondPizza,
  isMeia,
  selectedSize,
  onSelect,
}: SizeSelectorProps) {
  const { isMobile } = useBreakpoint();

  return (
    <div style={{ display: "flex", gap: isMobile ? 8 : 12 }}>
      {SIZE_ORDER.map((size: PizzaSize) => {
        const priceForSize = pizza.prices.find((p) => p.size === size)?.price;
        if (!priceForSize) return null;
        const computedBase =
          isMeia && secondPizza
            ? Math.max(
                priceForSize,
                secondPizza.prices.find((p) => p.size === size)?.price ?? 0,
              )
            : priceForSize;
        const on = selectedSize === size;
        return (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            style={{
              flex: 1,
              padding: isMobile ? "13px 8px 12px" : "16px 12px",
              borderRadius: "var(--radius-lg)",
              cursor: "pointer",
              background: on ? "var(--primary-soft)" : "var(--surface)",
              boxShadow: on
                ? "inset 0 0 0 2px var(--primary)"
                : "inset 0 0 0 1px var(--border-strong)",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: isMobile ? 3 : 4,
              transition: "all var(--dur-fast) var(--ease-soft)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: isMobile ? 14.5 : 16,
                color: on ? "var(--primary)" : "var(--fg1)",
              }}
            >
              {SIZE_LABELS[size]}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: isMobile ? 10.5 : 11.5,
                color: "var(--fg4)",
              }}
            >
              {SIZE_DESC[size]}
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: isMobile ? 15 : 17,
                color: "var(--fg1)",
                marginTop: isMobile ? 2 : 3,
                whiteSpace: "nowrap",
              }}
            >
              {formatPrice(computedBase)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
