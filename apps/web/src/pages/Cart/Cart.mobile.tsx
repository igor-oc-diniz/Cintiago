import type { CartData } from "./useCartData";
import { CartSummary } from "@/components/molecules/CartSummary";
import { PizzaCartCard } from "@/components/molecules/PizzaCartCard";
import { ProductCartCard } from "@/components/molecules/ProductCartCard";
import { SelectorRow } from "@/components/molecules/SelectorRow";
import { StoreClosedModal } from "@/components/molecules/StoreClosedModal";

const chipBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: 34,
  padding: "0 13px",
  borderRadius: "var(--radius-full)",
  border: "1px solid var(--border)",
  background: "var(--surface)",
  cursor: "pointer",
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: 12.5,
  color: "var(--fg2)",
};

export function CartMobile({
  navigate,
  isLoggedIn,
  pizzaItems,
  productItems,
  isEmpty,
  subtotal,
  deliveryType,
  paymentName,
  deliveryLabel,
  fee,
  total,
  ready,
  checkoutHint,
  formatPrice,
  handleQty,
  handleRemove,
  handleCheckout,
  checkingStatus,
  showClosedModal,
  closeClosedModal,
  openingHours,
}: CartData) {
  const header = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: isEmpty ? "16px" : "16px 16px 12px",
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
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
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      </button>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 24,
          color: "var(--fg1)",
          margin: 0,
        }}
      >
        Seu pedido
      </h1>
    </div>
  );

  if (isEmpty) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {header}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 24px",
            textAlign: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--surface-inset)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--fg4)"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </span>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 19,
              color: "var(--fg1)",
              lineHeight: 1.4,
            }}
          >
            Sua mesa ainda está vazia.
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              ...chipBtn,
              height: 44,
              padding: "0 20px",
              fontSize: 14,
              color: "var(--primary)",
              borderColor: "var(--border-strong)",
            }}
          >
            Ver o cardápio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {showClosedModal && (
        <StoreClosedModal
          onClose={closeClosedModal}
          openingHours={openingHours}
        />
      )}
      {header}

      {/* Scroll area */}
      <div
        className="cg-noscroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 16px 0",
          paddingBottom: 200,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pizzaItems.map((item) => (
            <PizzaCartCard
              key={item.id}
              item={item}
              onQty={(v) => handleQty(item.id, v)}
              onRemove={() => handleRemove(item.id)}
              onEdit={() => navigate(`/pizza/${item.halves[0].pizzaId}`)}
            />
          ))}
          {productItems.map((item) => (
            <ProductCartCard
              key={item.id}
              item={item}
              onQty={(v) => handleQty(item.id, v)}
              onRemove={() => handleRemove(item.id)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            marginTop: 12,
            height: 48,
            borderRadius: "var(--radius-lg)",
            cursor: "pointer",
            border: "1px dashed var(--border-strong)",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 14,
            color: "var(--fg2)",
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar mais itens
        </button>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 22,
          }}
        >
          <SelectorRow
            icon={
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent-warm)"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            }
            label="Entrega"
            value={deliveryLabel}
            placeholder="Selecionar forma de entrega"
            onClick={() => navigate("/cart/delivery")}
          />
          <SelectorRow
            icon={
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent-warm)"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            }
            label="Pagamento"
            value={paymentName}
            placeholder="Selecionar forma de pagamento"
            onClick={() => navigate("/cart/payment")}
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <hr className="cg-divider" />
          <div style={{ padding: "16px 2px 4px" }}>
            <CartSummary
              subtotal={subtotal}
              deliveryType={deliveryType}
              fee={fee}
              total={total}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 25,
          padding: "14px 16px 28px",
          background: "color-mix(in oklab, var(--parchment) 90%, transparent)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 -1px 0 var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: 9,
        }}
      >
        <button
          type="button"
          disabled={!ready || checkingStatus}
          onClick={handleCheckout}
          style={{
            width: "100%",
            height: 54,
            borderRadius: "var(--radius-lg)",
            border: "none",
            cursor: ready && !checkingStatus ? "pointer" : "not-allowed",
            background: ready ? "var(--primary)" : "var(--oat)",
            color: ready ? "var(--on-primary)" : "var(--fg4)",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: ready ? "var(--shadow-md)" : "none",
            transition: "background var(--dur-fast) var(--ease-soft)",
          }}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
          </svg>
          {checkingStatus ? "Verificando..." : "Finalizar pedido"}
        </button>

        {!isLoggedIn && (
          <button
            type="button"
            onClick={() => navigate("/login")}
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
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--fg3)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Criar cadastro
          </button>
        )}

        {!ready && checkoutHint && (
          <div
            style={{
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--fg4)",
            }}
          >
            {checkoutHint}
          </div>
        )}
      </div>
    </div>
  );
}
