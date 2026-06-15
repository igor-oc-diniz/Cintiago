import { useBreakpoint } from "@/hooks/useBreakpoint";
import type { CartProductItem } from "@/store/slices/cartSlice";
import { Stepper } from "@/components/molecules/Stepper";

export function ProductCartCard({
  item,
  onQty,
  onRemove,
}: {
  item: CartProductItem;
  onQty: (v: number) => void;
  onRemove?: () => void;
}) {
  const { isDesktop } = useBreakpoint();

  const imgSize = isDesktop ? 72 : 54;
  const padding = isDesktop ? 16 : 12;
  const gap = isDesktop ? 16 : 13;
  const nameSize = isDesktop ? 19 : 16;
  const subSize = isDesktop ? 13 : undefined;
  const priceSize = isDesktop ? 18 : 14;

  return (
    <div
      className="cg-card cg-grain"
      style={{ display: "flex", gap, padding, alignItems: "center" }}
    >
      <div
        style={{
          width: imgSize,
          height: imgSize,
          flexShrink: 0,
          borderRadius: "var(--radius-lg)",
          background: "linear-gradient(150deg, #DCE6DB 0%, #A9C0A6 100%)",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: nameSize,
            color: "var(--fg1)",
          }}
        >
          {item.productName}
        </div>
        {isDesktop && (
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: subSize,
              color: "var(--fg3)",
              marginTop: 2,
            }}
          >
            {item.unitPrice.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}{" "}
            cada
          </div>
        )}
        {!isDesktop && (
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: priceSize,
              color: "var(--fg1)",
              marginTop: 3,
            }}
          >
            {(item.unitPrice * item.quantity).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        )}
      </div>
      <Stepper
        value={item.quantity}
        onChange={onQty}
        size={isDesktop ? "md" : "sm"}
      />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remover item"
          style={{
            flexShrink: 0,
            width: isDesktop ? 36 : 32,
            height: isDesktop ? 36 : 32,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--fg3)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      )}
      {isDesktop && (
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: priceSize,
            color: "var(--fg1)",
            minWidth: 88,
            textAlign: "right",
          }}
        >
          {(item.unitPrice * item.quantity).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
      )}
    </div>
  );
}
