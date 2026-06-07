import type { ReactNode } from "react";

interface SumLineProps {
  label: string;
  value: ReactNode;
  sub?: string | null;
  strong?: boolean;
}

export function SumLine({ label, value, sub, strong = false }: SumLineProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 14,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: strong ? 700 : 500,
          fontSize: strong ? 15 : 13,
          color: strong ? "var(--fg1)" : "var(--fg3)",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span style={{ textAlign: "right", minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontFamily: strong ? "var(--font-display)" : "var(--font-body)",
            fontWeight: strong ? 700 : 600,
            fontSize: strong ? 20 : 13.5,
            color: "var(--fg1)",
            lineHeight: 1.35,
          }}
        >
          {value}
        </span>
        {sub && (
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--fg4)",
              marginTop: 1,
            }}
          >
            {sub}
          </span>
        )}
      </span>
    </div>
  );
}
