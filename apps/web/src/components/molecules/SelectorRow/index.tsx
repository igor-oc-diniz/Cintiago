import { useBreakpoint } from "@/hooks/useBreakpoint";

export function SelectorRow({
  icon,
  label,
  value,
  placeholder,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  placeholder: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const { isDesktop } = useBreakpoint();
  const empty = !value;

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 13,
        width: "100%",
        textAlign: "left",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: isDesktop ? "13px 14px" : "14px",
        borderRadius: "var(--radius-lg)",
        border: "none",
        background: "var(--surface)",
        boxShadow: "inset 0 0 0 1px var(--border)",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: "var(--radius-md)",
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          background: "var(--surface-inset)",
        }}
      >
        {icon}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-body)",
            fontSize: isDesktop ? 11 : 11.5,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--fg4)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-body)",
            fontWeight: empty ? 500 : 600,
            fontSize: 14.5,
            color: empty ? "var(--fg4)" : "var(--fg1)",
            marginTop: 2,
          }}
        >
          {value ?? placeholder}
        </span>
      </span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--fg4)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}
