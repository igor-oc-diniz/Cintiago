import type { RadioDotProps } from "./types";

export function RadioDot({ on }: RadioDotProps) {
  return (
    <span
      style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        background: on ? "var(--primary)" : "transparent",
        boxShadow: on ? "none" : "inset 0 0 0 2px var(--border-strong)",
        transition: "background var(--dur-fast) var(--ease-soft)",
      }}
    >
      {on && (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--on-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </span>
  );
}
