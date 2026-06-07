import type { OptionCardProps } from "./types";

export function OptionCard({ selected, onClick, children }: OptionCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      style={{
        position: "relative",
        borderRadius: "var(--radius-xl)",
        cursor: "pointer",
        background: selected ? "var(--primary-soft)" : "var(--surface)",
        boxShadow: selected
          ? "inset 0 0 0 2px var(--primary), var(--shadow-xs)"
          : "inset 0 0 0 1px var(--border), var(--shadow-xs)",
        transition:
          "box-shadow var(--dur-fast) var(--ease-soft), background var(--dur-fast) var(--ease-soft)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}
