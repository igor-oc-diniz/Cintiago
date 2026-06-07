import { IconTile } from "@/components/atoms/IconTile";
import { RadioDot } from "@/components/atoms/RadioDot";
import type { CardHeadProps } from "./types";

export function CardHead({ icon, tone, title, sub, on }: CardHeadProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <IconTile icon={icon} tone={tone} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--fg1)",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12.5,
            color: "var(--fg3)",
            marginTop: 2,
          }}
        >
          {sub}
        </div>
      </div>
      <RadioDot on={on} />
    </div>
  );
}
