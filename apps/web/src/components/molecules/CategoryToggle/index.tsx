import { useBreakpoint } from "@/hooks/useBreakpoint";

export function CategoryToggle({
  value,
  onChange,
}: {
  value: "pizzas" | "extras";
  onChange: (v: "pizzas" | "extras") => void;
}) {
  const { isDesktop } = useBreakpoint();

  const tabs = [
    { key: "pizzas" as const, label: "Pizzas" },
    { key: "extras" as const, label: "Extras" },
  ];

  return (
    <div
      style={{
        display: isDesktop ? "inline-grid" : "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 4,
        padding: 4,
        background: "var(--surface-inset)",
        borderRadius: "var(--radius-full)",
        boxShadow: "var(--shadow-inset)",
      }}
    >
      {tabs.map(({ key, label }) => {
        const on = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            style={{
              height: isDesktop ? 44 : 42,
              padding: isDesktop ? "0 30px" : undefined,
              borderRadius: "var(--radius-full)",
              border: "none",
              cursor: "pointer",
              background: on ? "var(--surface)" : "transparent",
              color: on ? "var(--fg1)" : "var(--fg3)",
              fontFamily: "var(--font-body)",
              fontWeight: on ? 700 : 600,
              fontSize: 15,
              boxShadow: on ? "var(--shadow-sm)" : "none",
              transition: "all var(--dur-fast) var(--ease-soft)",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
