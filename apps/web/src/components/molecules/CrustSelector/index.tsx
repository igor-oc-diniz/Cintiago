import { formatPrice } from "@/utils/format";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import type { Crust } from "@/types/domain";

interface CrustSelectorProps {
  crusts: Crust[];
  selectedCrustId: number | null;
  selectedSize: "small" | "medium" | "large";
  onSelect: (id: number | null) => void;
}

export function CrustSelector({
  crusts,
  selectedCrustId,
  selectedSize,
  onSelect,
}: CrustSelectorProps) {
  const { isMobile } = useBreakpoint();

  const containerStyle: React.CSSProperties = isMobile
    ? {
        display: "flex",
        gap: 8,
        overflowX: "auto",
        padding: "0 16px",
        margin: "0 -16px",
      }
    : { display: "flex", gap: 12, flexWrap: "wrap" };

  return (
    <div
      className={isMobile ? "cg-noscroll" : undefined}
      style={containerStyle}
    >
      {crusts.map((c) => {
        const on = selectedCrustId === c.id;
        const price = c.prices.find((p) => p.size === selectedSize)?.price ?? 0;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(on ? null : c.id)}
            style={{
              flexShrink: 0,
              minWidth: isMobile ? 104 : 120,
              padding: isMobile ? "10px 14px" : "12px 16px",
              borderRadius: "var(--radius-lg)",
              cursor: "pointer",
              background: on ? "var(--primary-soft)" : "var(--surface)",
              boxShadow: on
                ? "inset 0 0 0 2px var(--primary)"
                : "inset 0 0 0 1px var(--border-strong)",
              border: "none",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 2 : 3,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: isMobile ? 13.5 : 14.5,
                color: on ? "var(--primary)" : "var(--fg1)",
              }}
            >
              {c.name}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: isMobile ? 12 : 12.5,
                color: "var(--fg3)",
              }}
            >
              {price === 0 ? "Grátis" : `+ ${formatPrice(price)}`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
