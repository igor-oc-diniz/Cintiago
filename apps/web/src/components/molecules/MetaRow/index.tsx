import type { MetaRowProps } from "./types";

export function MetaRow({ icon, label, value, accent }: MetaRowProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span style={{ flexShrink: 0, display: "flex", color: "var(--fg4)" }}>
        {icon}
      </span>
      <span
        style={{
          flex: 1,
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--fg3)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 13.5,
          color: accent ? "var(--success-hover)" : "var(--fg1)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
