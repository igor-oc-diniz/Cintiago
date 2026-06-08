import type { CSSProperties } from "react";
import { CheckIcon } from "@/components/atoms/Icons";
import type { TimelineStepProps } from "./types";

const NODE_SIZE = 38;

const nodeStyle: Record<string, CSSProperties> = {
  done: {
    background: "var(--fg1)",
    color: "var(--parchment)",
    border: "none",
  },
  active: {
    background: "var(--primary-soft)",
    color: "var(--primary)",
    border: "1.5px solid var(--primary)",
  },
  todo: {
    background: "var(--surface)",
    color: "var(--fg4)",
    border: "1.5px solid var(--border)",
  },
};

export function TimelineStep({
  icon,
  label,
  timestamp,
  state,
  isLast = false,
}: TimelineStepProps) {
  const isDone = state === "done";
  const isActive = state === "active";

  return (
    <div style={{ display: "flex", gap: 14 }}>
      {/* rail: node + connector */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: NODE_SIZE,
            height: NODE_SIZE,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            transition: "background 0.2s, border 0.2s",
            ...nodeStyle[state],
          }}
        >
          {isDone ? <CheckIcon size={19} strokeWidth={2.6} /> : icon}
        </div>

        {!isLast && (
          <div
            style={{
              flex: 1,
              minHeight: 26,
              margin: "4px 0",
              width: 0,
              borderLeft: isDone
                ? "2px solid var(--fg3)"
                : "2px dashed var(--basil-300)",
              opacity: isDone ? 0.4 : 0.6,
            }}
          />
        )}
      </div>

      {/* label + timestamp */}
      <div
        style={{
          paddingTop: 7,
          paddingBottom: isLast ? 0 : 18,
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: isActive || isDone ? 600 : 500,
            fontSize: 15,
            color: isActive
              ? "var(--primary)"
              : isDone
                ? "var(--fg1)"
                : "var(--fg4)",
            lineHeight: 1.25,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12.5,
            color: isActive ? "var(--accent-warm)" : "var(--fg4)",
            marginTop: 3,
          }}
        >
          {timestamp
            ? `Concluído às ${timestamp}`
            : isActive
              ? "Em andamento"
              : "Aguardando"}
        </div>
      </div>
    </div>
  );
}
