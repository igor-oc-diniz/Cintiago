import type { IconTileProps } from "./types";

const TONE_MAP = {
  gold: { bg: "var(--surface-inset)", fg: "var(--accent-warm)" },
  terra: { bg: "var(--primary-soft)", fg: "var(--primary)" },
  basil: { bg: "var(--success-soft)", fg: "var(--success-hover)" },
} as const;

export function IconTile({ icon, tone = "gold" }: IconTileProps) {
  const { bg } = TONE_MAP[tone];
  return (
    <span
      style={{
        width: 42,
        height: 42,
        borderRadius: "var(--radius-md)",
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        background: bg,
      }}
    >
      {icon}
    </span>
  );
}
