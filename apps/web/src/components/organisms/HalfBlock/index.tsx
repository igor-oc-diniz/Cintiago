import { useBreakpoint } from "@/hooks/useBreakpoint";
import { IngredientChip } from "@/components/molecules/IngredientChip";
import { AddonRow } from "@/components/molecules/AddonRow";

type Ingredient = { id: number; name: string; price: number };

export function HalfBlock({
  label,
  pizzaName,
  defaultIngs,
  addonIngs,
  removedIds,
  addedIds,
  onRemove,
  onAdd,
}: {
  label?: string;
  pizzaName: string;
  defaultIngs: Ingredient[];
  addonIngs: Ingredient[];
  removedIds: number[];
  addedIds: number[];
  onRemove: (id: number) => void;
  onAdd: (id: number) => void;
}) {
  const { isDesktop } = useBreakpoint();

  const dotSize = isDesktop ? 9 : 8;
  const labelFontSize = isDesktop ? 13.5 : 13;
  const subFontSize = isDesktop ? 12.5 : 12.5;
  const sectionLabelSize = isDesktop ? 11 : 11.5;
  const labelMarginBottom = isDesktop ? 12 : 10;
  const chipRowMarginBottom = isDesktop ? 16 : 14;

  return (
    <div style={isDesktop ? { flex: 1, minWidth: 0 } : undefined}>
      {label && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: labelMarginBottom,
          }}
        >
          <span
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              background: "var(--accent-warm)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: labelFontSize,
              color: "var(--fg1)",
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: subFontSize,
              color: "var(--fg3)",
            }}
          >
            · {pizzaName}
          </span>
        </div>
      )}
      {defaultIngs.length > 0 && (
        <>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: sectionLabelSize,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--fg4)",
              marginBottom: isDesktop ? 9 : 8,
            }}
          >
            Vem com · toque p/ remover
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 7,
              marginBottom: chipRowMarginBottom,
            }}
          >
            {defaultIngs.map((ing) => (
              <IngredientChip
                key={ing.id}
                name={ing.name}
                removed={removedIds.includes(ing.id)}
                onToggle={() => onRemove(ing.id)}
              />
            ))}
          </div>
        </>
      )}
      {addonIngs.length > 0 && (
        <>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: sectionLabelSize,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--fg4)",
              marginBottom: isDesktop ? 9 : 8,
            }}
          >
            Adicionar
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {addonIngs.map((ing) => (
              <AddonRow
                key={ing.id}
                name={ing.name}
                price={ing.price}
                active={addedIds.includes(ing.id)}
                onToggle={() => onAdd(ing.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
