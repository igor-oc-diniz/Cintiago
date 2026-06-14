import { CheckIcon } from "@/components/atoms/Icons";
import type { HTimelineProps, TimelineNodeState } from "./types";

const NODE_SIZE = 44;

function nodeStateStyles(state: TimelineNodeState): React.CSSProperties {
  if (state === "done") {
    return {
      background: "var(--primary, #C0522A)",
      border: "none",
      color: "var(--parchment, #FAF3E2)",
    };
  }
  if (state === "active") {
    return {
      background: "var(--primary-soft, rgba(192,82,42,0.1))",
      border: "2px solid var(--primary, #C0522A)",
      color: "var(--primary, #C0522A)",
    };
  }
  return {
    background: "var(--surface-inset, #F0EAE0)",
    border: "2px solid var(--border, #E8E0D0)",
    color: "var(--fg4, #B0A090)",
  };
}

export function HTimeline({
  stages,
  activeIndex,
  isDelivered,
}: HTimelineProps) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      {stages.map((stage, i) => {
        const state: TimelineNodeState =
          i < activeIndex
            ? "done"
            : i === activeIndex
              ? isDelivered
                ? "done"
                : "active"
              : "todo";

        const isDone = state === "done";
        const isActive = state === "active";

        const displayTime =
          stage.timestamp && stage.timestamp !== "—"
            ? stage.timestamp
            : isActive
              ? "agora"
              : isDone
                ? ""
                : "—";

        return (
          <div
            key={stage.key}
            style={{
              flex: 1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* connector line */}
            {i > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: NODE_SIZE / 2 - 1,
                  right: "50%",
                  width: "100%",
                  height: 2,
                  background:
                    i <= activeIndex
                      ? "var(--primary, #C0522A)"
                      : "var(--border, #E8E0D0)",
                  zIndex: 0,
                  backgroundImage:
                    i <= activeIndex
                      ? "none"
                      : "repeating-linear-gradient(90deg, var(--border, #E8E0D0) 0 6px, transparent 6px 12px)",
                }}
              />
            )}

            {/* node */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                width: NODE_SIZE,
                height: NODE_SIZE,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                ...nodeStateStyles(state),
              }}
            >
              {isDone ? (
                <CheckIcon size={21} strokeWidth={2.6} color="currentColor" />
              ) : (
                stage.icon
              )}
            </div>

            {/* label + time */}
            <div style={{ marginTop: 12, padding: "0 6px" }}>
              <div
                style={{
                  fontFamily: "var(--font-body, sans-serif)",
                  fontWeight: isActive || isDone ? 600 : 500,
                  fontSize: 13.5,
                  color: isActive
                    ? "var(--primary, #C0522A)"
                    : isDone
                      ? "var(--fg1, #1A1410)"
                      : "var(--fg4, #B0A090)",
                  lineHeight: 1.3,
                }}
              >
                {stage.label}
              </div>
              {displayTime && (
                <div
                  style={{
                    fontFamily: "var(--font-body, sans-serif)",
                    fontSize: 12,
                    color: isActive
                      ? "var(--accent-warm, #C0522A)"
                      : "var(--fg4, #B0A090)",
                    marginTop: 4,
                  }}
                >
                  {displayTime}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
