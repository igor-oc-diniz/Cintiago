import type { InfoBlockProps } from "./types";

export function InfoBlock({ icon, label, value, sub }: InfoBlockProps) {
  return (
    <div style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
      <span
        style={{
          width: 42,
          height: 42,
          borderRadius: "var(--radius-md, 8px)",
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          background: "var(--surface-inset, #F0EAE0)",
        }}
      >
        {icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--fg4, #B0A090)",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body, sans-serif)",
            fontWeight: 600,
            fontSize: 15,
            color: "var(--fg1, #1A1410)",
            marginTop: 3,
          }}
        >
          {value}
        </div>
        {sub && (
          <div
            style={{
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: 13,
              color: "var(--fg3, #7A6A5A)",
              marginTop: 1,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
