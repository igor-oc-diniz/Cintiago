import { useBreakpoint } from "@/hooks/useBreakpoint";
import { formatPrice } from "@/utils/format";

export function AddonRow({
  name,
  price,
  active,
  onToggle,
  isFree,
}: {
  name: string;
  price: number;
  active: boolean;
  onToggle: () => void;
  isFree?: boolean;
}) {
  const { isDesktop } = useBreakpoint();

  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: isDesktop ? 11 : 10,
        width: "100%",
        padding: isDesktop ? "11px 13px" : "10px 12px",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        background: active ? "var(--success-soft)" : "var(--surface)",
        boxShadow: active
          ? "inset 0 0 0 1.5px var(--success)"
          : "inset 0 0 0 1px var(--border)",
        border: "none",
        textAlign: "left",
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          background: active ? "var(--success)" : "transparent",
          boxShadow: active ? "none" : "inset 0 0 0 1.5px var(--border-strong)",
        }}
      >
        {active && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--parchment)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span
        style={{
          flex: 1,
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: 14,
          color: "var(--fg1)",
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 13,
          color: isFree
            ? "var(--success)"
            : active
              ? "var(--success-hover)"
              : "var(--fg3)",
        }}
      >
        {isFree ? "Grátis" : `+ ${formatPrice(price)}`}
      </span>
    </button>
  );
}
