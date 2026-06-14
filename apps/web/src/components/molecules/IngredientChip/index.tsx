import { useBreakpoint } from "@/hooks/useBreakpoint";

export function IngredientChip({ name }: { name: string }) {
  const { isDesktop } = useBreakpoint();

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: isDesktop ? "8px 13px" : "7px 12px",
        borderRadius: "var(--radius-full)",
        background: "var(--surface)",
        boxShadow: "inset 0 0 0 1px var(--border-strong)",
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        fontSize: isDesktop ? 13.5 : 13,
        color: "var(--fg2)",
      }}
    >
      {name}
    </span>
  );
}
