interface OrderSealProps {
  number: number;
}

export function OrderSeal({ number }: OrderSealProps) {
  return (
    <div className="cg-seal">
      <div style={{ position: "relative", textAlign: "center", lineHeight: 1 }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--gold-100)",
            opacity: 0.92,
          }}
        >
          Pedido
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 30,
            color: "var(--parchment)",
            marginTop: 5,
          }}
        >
          {number}
        </div>
      </div>
    </div>
  );
}
