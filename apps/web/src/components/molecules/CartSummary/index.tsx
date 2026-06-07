interface CartSummaryProps {
  subtotal: number;
  deliveryType: string | null | undefined;
  fee: number;
  total: number;
  formatPrice: (n: number) => string;
}

export function CartSummary({
  subtotal,
  deliveryType,
  fee,
  total,
  formatPrice,
}: CartSummaryProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: 14,
            color: "var(--fg2)",
          }}
        >
          Subtotal
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: 14,
            color: "var(--fg1)",
          }}
        >
          {formatPrice(subtotal)}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: 14,
            color: "var(--fg2)",
          }}
        >
          Taxa de entrega
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: 14,
            color:
              deliveryType === "delivery" ? "var(--fg1)" : "var(--fg4)",
          }}
        >
          {deliveryType === "delivery" ? formatPrice(fee) : "a definir"}
        </span>
      </div>
      <div style={{ height: 2 }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--fg1)",
          }}
        >
          Total
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 22,
            color: "var(--fg1)",
          }}
        >
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
}
