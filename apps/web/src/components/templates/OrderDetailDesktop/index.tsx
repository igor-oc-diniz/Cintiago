import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { WebNav } from "@/components/molecules/WebNav";
import { InfoBlock } from "@/components/molecules/InfoBlock";
import { RatingCard } from "@/components/molecules/RatingCard";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import {
  ArrowLeftIcon,
  BikeIcon,
  WalletIcon,
  RotateCcwIcon,
  LeafIcon,
} from "@/components/atoms/Icons";
import { formatDate } from "@/utils/format";
import type { OrderStatus } from "@cintiago/shared";
import type { OrderDetailDesktopProps } from "./types";

function FinRow({
  label,
  value,
  strong,
  muted,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body, sans-serif)",
          fontWeight: strong ? 700 : 400,
          fontSize: strong ? 16 : 14,
          color: strong ? "var(--fg1, #1A1410)" : "var(--fg2, #3A2E24)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: strong
            ? "var(--font-display, serif)"
            : "var(--font-body, sans-serif)",
          fontWeight: strong ? 700 : 500,
          fontSize: strong ? 24 : 14,
          color: muted ? "var(--fg4, #B0A090)" : "var(--fg1, #1A1410)",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function OrderDetailDesktop({
  order,
  isLoading,
  isError,
  isDelivered,
  isDelivery,
  statusLabel,
  localRating,
  formatPrice,
  handleBack,
  handleRepeat,
  handleRate,
  getItemCustomLines,
  getItemSubtitle,
}: OrderDetailDesktopProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg, #F5EFE6)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg, #F5EFE6)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <p style={{ fontFamily: "var(--font-body)", color: "var(--fg3)" }}>
          Pedido não encontrado.
        </p>
      </div>
    );
  }

  const deliveryAddress = `${order.client?.street ?? ""}, ${order.client?.number ?? ""}`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #F5EFE6)" }}>
      <WebNav
        active="orders"
        userName={user?.name ?? ""}
        userEmail={user?.email ?? ""}
        userInitials={(user?.name ?? "U").slice(0, 2).toUpperCase()}
        onHome={() => navigate("/")}
        onOrders={handleBack}
        onProfile={() => navigate("/profile")}
      />

      <div
        style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 36px 80px" }}
      >
        {/* Back */}
        <button
          onClick={handleBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 0",
            fontFamily: "var(--font-body, sans-serif)",
            fontWeight: 600,
            fontSize: 14,
            color: "var(--fg3, #7A6A5A)",
            marginBottom: 10,
          }}
        >
          <ArrowLeftIcon size={18} color="var(--fg3, #7A6A5A)" />
          Voltar aos pedidos
        </button>

        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 26,
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display, serif)",
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: "-0.01em",
              color: "var(--fg1, #1A1410)",
              margin: 0,
              flexShrink: 0,
            }}
          >
            Pedido #{order.id}
          </h1>
          <Badge variant={order.status as OrderStatus}>{statusLabel}</Badge>
          <span
            style={{
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: 14,
              color: "var(--fg3, #7A6A5A)",
              marginLeft: "auto",
            }}
          >
            {formatDate(order.createdAt)}
          </span>
        </div>

        {/* 2-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Items */}
            <div className="cg-card cg-grain" style={{ padding: 24 }}>
              <div
                style={{
                  fontFamily: "var(--font-display, serif)",
                  fontWeight: 600,
                  fontSize: 19,
                  color: "var(--fg1, #1A1410)",
                  marginBottom: 18,
                }}
              >
                Itens
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                {order.orderItems.map((item) => {
                  const customLines = getItemCustomLines(item);
                  const sub = getItemSubtitle(item);
                  const names =
                    item.halves.length === 2
                      ? `${item.halves[0].pizza.name} / ${item.halves[1].pizza.name}`
                      : (item.halves[0]?.pizza.name ?? "Pizza");

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          minWidth: 30,
                          height: 26,
                          padding: "0 8px",
                          borderRadius: "var(--radius-sm, 6px)",
                          flexShrink: 0,
                          background: "var(--surface-inset, #F0EAE0)",
                          display: "grid",
                          placeItems: "center",
                          fontFamily: "var(--font-body, sans-serif)",
                          fontWeight: 700,
                          fontSize: 13.5,
                          color: "var(--fg2, #3A2E24)",
                        }}
                      >
                        {item.quantity}×
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "var(--font-body, sans-serif)",
                            fontWeight: 600,
                            fontSize: 15.5,
                            color: "var(--fg1, #1A1410)",
                            lineHeight: 1.3,
                          }}
                        >
                          {names}
                        </div>
                        {sub && (
                          <div
                            style={{
                              fontFamily: "var(--font-body, sans-serif)",
                              fontSize: 13,
                              color: "var(--fg3, #7A6A5A)",
                              marginTop: 2,
                            }}
                          >
                            {sub}
                          </div>
                        )}
                        {customLines.map((line, i) => (
                          <div
                            key={i}
                            style={{
                              fontFamily: "var(--font-body, sans-serif)",
                              fontSize: 12.5,
                              color: "var(--fg4, #B0A090)",
                              marginTop: 3,
                              lineHeight: 1.4,
                            }}
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {order.orderProducts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        minWidth: 30,
                        height: 26,
                        padding: "0 8px",
                        borderRadius: "var(--radius-sm, 6px)",
                        flexShrink: 0,
                        background: "var(--surface-inset, #F0EAE0)",
                        display: "grid",
                        placeItems: "center",
                        fontFamily: "var(--font-body, sans-serif)",
                        fontWeight: 700,
                        fontSize: 13.5,
                        color: "var(--fg2, #3A2E24)",
                      }}
                    >
                      {p.quantity}×
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-body, sans-serif)",
                          fontWeight: 600,
                          fontSize: 15.5,
                          color: "var(--fg1, #1A1410)",
                        }}
                      >
                        {p.product.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery + Payment info */}
            <div className="cg-card cg-grain" style={{ padding: 24 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                }}
              >
                <InfoBlock
                  icon={
                    <BikeIcon size={20} color="var(--accent-warm, #C0522A)" />
                  }
                  label={isDelivery ? "Entrega" : "Retirada"}
                  value={isDelivery ? "Delivery" : "Retirar no balcão"}
                  sub={isDelivery ? deliveryAddress : undefined}
                />
                <InfoBlock
                  icon={
                    <WalletIcon size={20} color="var(--accent-warm, #C0522A)" />
                  }
                  label="Pagamento"
                  value={order.payment?.name ?? "—"}
                />
              </div>
            </div>

            {/* Rating (only for delivered) */}
            {isDelivered && (
              <RatingCard localRating={localRating} onSubmit={handleRate} />
            )}
          </div>

          {/* RIGHT — sticky financials */}
          <div
            className="cg-card cg-grain"
            style={{ position: "sticky", top: 100, padding: 22 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display, serif)",
                  fontWeight: 600,
                  fontSize: 19,
                  color: "var(--fg1, #1A1410)",
                }}
              >
                Pagamento
              </div>
              <LeafIcon
                size={16}
                color="var(--basil-300, #A8C5A0)"
                style={{ opacity: 0.75 }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <FinRow
                label="Subtotal"
                value={formatPrice(Number(order.total ?? 0))}
              />
              <FinRow
                label="Taxa de entrega"
                value={isDelivery ? "–" : "Grátis"}
                muted={!isDelivery}
              />
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--border, #E8E0D0)",
                  margin: "5px 0",
                }}
              />
              <FinRow
                label="Total"
                value={formatPrice(Number(order.total ?? 0))}
                strong
              />
            </div>

            {isDelivered && (
              <div style={{ marginTop: 20 }}>
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => handleRepeat(order)}
                >
                  <RotateCcwIcon size={16} />
                  Repetir pedido
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
