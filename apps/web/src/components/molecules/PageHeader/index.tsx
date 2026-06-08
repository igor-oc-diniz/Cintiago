import type { ReactNode } from "react";
import { ArrowLeftIcon } from "@/components/atoms/Icons";

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  onBack?: () => void;
  right?: ReactNode;
}

export function PageHeader({ title, eyebrow, onBack, right }: PageHeaderProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "var(--bg)",
        padding: "calc(env(safe-area-inset-top) + 50px) 16px 10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {onBack ? (
          <button
            onClick={onBack}
            aria-label="Voltar"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <ArrowLeftIcon size={20} color="var(--fg1)" />
          </button>
        ) : (
          <span style={{ width: 2 }} />
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          {eyebrow && (
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--fg4)",
                marginBottom: 2,
              }}
            >
              {eyebrow}
            </div>
          )}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 25,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: "var(--fg1)",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </h1>
        </div>
        {right}
      </div>
    </div>
  );
}
