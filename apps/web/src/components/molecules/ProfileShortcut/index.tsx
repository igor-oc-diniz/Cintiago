import { ChevronRightIcon } from "@/components/atoms/Icons";
import type { ProfileShortcutProps } from "./types";

export function ProfileShortcut({
  icon,
  label,
  onClick,
}: ProfileShortcutProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 13,
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        padding: "15px 16px",
        borderRadius: "var(--radius-lg, 12px)",
        border: "none",
        background: "var(--surface, #FFFFFF)",
        boxShadow: "inset 0 0 0 1px var(--border, #E8E0D0)",
      }}
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: "var(--radius-md, 8px)",
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          background: "var(--surface-inset, #F0EAE0)",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          flex: 1,
          fontFamily: "var(--font-body, sans-serif)",
          fontWeight: 600,
          fontSize: 15,
          color: "var(--fg1, #1A1410)",
        }}
      >
        {label}
      </span>
      <ChevronRightIcon size={20} color="var(--fg4, #B0A090)" />
    </button>
  );
}
