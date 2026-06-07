import { CheckAnimation } from "@/components/atoms/CheckAnimation";
import { OrderSeal } from "@/components/atoms/OrderSeal";
import { Spinner } from "@/components/atoms/Spinner";
import { SumLine } from "@/components/molecules/SumLine";
import { MapPinIcon, HouseIcon, LeafIcon } from "@/components/atoms/Icons";
import type { OrderConfirmData } from "@/hooks/useOrderConfirm";

export function OrderConfirmMobile({
  order,
  isLoading,
  isError,
  itemLines,
  deliveryLabel,
  addressSub,
  paymentLabel,
  total,
  DELIVERY_ETA,
  formatPrice,
  handleTrack,
  handleHome,
}: OrderConfirmData) {
  if (isLoading) {
    return (
      <div
        style={{
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          background: "var(--bg)",
        }}
      >
        <Spinner size="md" />
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--fg3)",
          }}
        >
          Confirmando seu pedido…
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "0 32px",
          background: "var(--bg)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: "var(--fg1)",
            fontWeight: 600,
          }}
        >
          Não foi possível confirmar seu pedido.
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--fg3)",
          }}
        >
          Verifique sua conexão e tente novamente pelo carrinho.
        </p>
        <button
          type="button"
          onClick={handleHome}
          style={{
            marginTop: 8,
            padding: "10px 24px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-strong)",
            background: "transparent",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 14,
            color: "var(--fg1)",
            cursor: "pointer",
          }}
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  const itemsNode = itemLines.map((line, i) => (
    <span key={i} style={{ display: "block" }}>
      {line}
    </span>
  ));

  return (
    <div
      style={{
        position: "relative",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "calc(env(safe-area-inset-top, 0px) + 56px) 18px 0",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Success header */}
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CheckAnimation />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 30,
              color: "var(--fg1)",
              margin: "14px 0 6px",
              letterSpacing: "-0.01em",
            }}
          >
            Pedido realizado!
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              lineHeight: 1.55,
              color: "var(--fg3)",
              margin: "0 auto",
              maxWidth: 280,
            }}
          >
            Estamos acendendo o forno. Já cuidamos do seu pedido.
          </p>
        </div>

        {/* Wax seal */}
        {order && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "26px 0 24px",
            }}
          >
            <OrderSeal number={order.id} />
          </div>
        )}

        {/* ETA + status */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--accent-warm)",
            }}
          >
            Previsão de entrega
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 26,
              color: "var(--fg1)",
              margin: "4px 0 14px",
            }}
          >
            {DELIVERY_ETA}
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 14px",
              borderRadius: 999,
              background: "var(--accent-soft)",
              color: "var(--gold-800)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 12.5,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--gold-500)",
                flexShrink: 0,
              }}
            />
            Aguardando confirmação
          </span>
        </div>

        {/* Summary card */}
        <div style={{ marginTop: 26 }}>
          <hr className="cg-divider" />
          <div
            className="cg-card cg-grain"
            style={{ padding: 16, position: "relative", marginTop: 16 }}
          >
            <div
              style={{
                position: "absolute",
                top: 14,
                right: 16,
                color: "var(--basil-300)",
                opacity: 0.75,
                zIndex: 3,
              }}
            >
              <LeafIcon size={15} color="var(--basil-300)" strokeWidth={1.8} />
            </div>

            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 17,
                  color: "var(--fg1)",
                  marginBottom: 13,
                }}
              >
                Resumo do pedido
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <SumLine label="Itens" value={itemsNode} />
                <hr className="cg-divider" />
                <SumLine
                  label="Entrega"
                  value={deliveryLabel ?? ""}
                  sub={addressSub}
                />
                <SumLine label="Pagamento" value={paymentLabel} />
                <hr className="cg-divider" />
                <SumLine label="Total" value={formatPrice(total)} strong />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacer for footer */}
        <div style={{ height: 176 }} />
      </div>

      {/* Fixed footer */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 25,
          padding: "14px 16px calc(env(safe-area-inset-bottom, 0px) + 20px)",
          background: "color-mix(in oklab, var(--parchment) 90%, transparent)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 -1px 0 var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: 9,
        }}
      >
        {order && (
          <button
            type="button"
            onClick={handleTrack}
            style={{
              width: "100%",
              height: 54,
              borderRadius: "var(--radius-lg)",
              border: "none",
              cursor: "pointer",
              background: "var(--primary)",
              color: "var(--on-primary)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: "var(--shadow-md)",
            }}
          >
            <MapPinIcon size={18} color="currentColor" />
            Acompanhar pedido
          </button>
        )}
        <button
          type="button"
          onClick={handleHome}
          style={{
            width: "100%",
            height: 46,
            borderRadius: "var(--radius-lg)",
            cursor: "pointer",
            border: "1px solid var(--border-strong)",
            background: "transparent",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 14.5,
            color: "var(--fg1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <HouseIcon size={17} color="var(--fg3)" />
          Voltar ao início
        </button>
      </div>
    </div>
  );
}
