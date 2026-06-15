import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { InfoBlock } from "@/components/molecules/InfoBlock";
import { RatingCard } from "@/components/molecules/RatingCard";
import { PageHeader } from "@/components/molecules/PageHeader";
import {
  BikeIcon,
  WalletIcon,
  RotateCcwIcon,
  LeafIcon,
} from "@/components/atoms/Icons";
import { formatDate } from "@/utils/format";
import type { OrderStatus } from "@cintiago/shared";
import type { OrderDetailDesktopProps } from "@/components/templates/OrderDetailDesktop/types";

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
          fontSize: strong ? 15 : 13,
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
          fontSize: strong ? 20 : 13,
          color: muted ? "var(--fg4, #B0A090)" : "var(--fg1, #1A1410)",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function OrderDetailMobile({
  order,
  isLoading,
  isError,
  isDelivered,
  isDelivery,
  statusLabel,
  existingRating,
  formatPrice,
  handleBack,
  handleRepeat,
  handleRate,
  getItemCustomLines,
  getItemSubtitle,
}: OrderDetailDesktopProps) {
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
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
          minHeight: "100dvh",
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
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg, #F5EFE6)",
        paddingBottom: 32,
      }}
    >
      <PageHeader
        title={`Pedido #${order.id}`}
        eyebrow={formatDate(order.createdAt)}
        onBack={handleBack}
      />

      <div style={{ padding: "12px 16px 0" }}>
        {/* Status badge */}
        <div style={{ marginBottom: 20 }}>
          <Badge variant={order.status as OrderStatus}>{statusLabel}</Badge>
        </div>

        {/* Items */}
        <div
          className="cg-card cg-grain"
          style={{ padding: "18px 16px", marginBottom: 12 }}
        >
          <div
            style={{
              fontFamily: "var(--font-display, serif)",
              fontWeight: 600,
              fontSize: 16,
              color: "var(--fg1, #1A1410)",
              marginBottom: 14,
            }}
          >
            Itens
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      minWidth: 28,
                      height: 24,
                      padding: "0 7px",
                      borderRadius: "var(--radius-sm, 6px)",
                      flexShrink: 0,
                      background: "var(--surface-inset, #F0EAE0)",
                      display: "grid",
                      placeItems: "center",
                      fontFamily: "var(--font-body, sans-serif)",
                      fontWeight: 700,
                      fontSize: 12.5,
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
                        fontSize: 14.5,
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
                          fontSize: 12,
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
                          fontSize: 11.5,
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
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <span
                  style={{
                    minWidth: 28,
                    height: 24,
                    padding: "0 7px",
                    borderRadius: "var(--radius-sm, 6px)",
                    flexShrink: 0,
                    background: "var(--surface-inset, #F0EAE0)",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-body, sans-serif)",
                    fontWeight: 700,
                    fontSize: 12.5,
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
                      fontSize: 14.5,
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
        <div
          className="cg-card cg-grain"
          style={{ padding: "18px 16px", marginBottom: 12 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <InfoBlock
              icon={<BikeIcon size={18} color="var(--accent-warm, #C0522A)" />}
              label={isDelivery ? "Entrega" : "Retirada"}
              value={isDelivery ? "Delivery" : "Retirar no balcão"}
              sub={deliveryAddress}
            />
            <InfoBlock
              icon={
                <WalletIcon size={18} color="var(--accent-warm, #C0522A)" />
              }
              label="Pagamento"
              value={order.payment?.name ?? "—"}
            />
          </div>
        </div>

        {/* Financials */}
        <div
          className="cg-card cg-grain"
          style={{ padding: "18px 16px", marginBottom: 12 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display, serif)",
                fontWeight: 600,
                fontSize: 16,
                color: "var(--fg1, #1A1410)",
              }}
            >
              Resumo
            </div>
            <LeafIcon
              size={14}
              color="var(--basil-300, #A8C5A0)"
              style={{ opacity: 0.75 }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
                margin: "4px 0",
              }}
            />
            <FinRow
              label="Total"
              value={formatPrice(Number(order.total ?? 0))}
              strong
            />
          </div>
        </div>

        {/* Rating */}
        {isDelivered && (
          <div style={{ marginBottom: 12 }}>
            <RatingCard existingRating={existingRating} onSubmit={handleRate} />
          </div>
        )}

        {/* Repeat order CTA */}
        {isDelivered && (
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => handleRepeat(order)}
          >
            <RotateCcwIcon size={16} />
            Repetir pedido
          </Button>
        )}
      </div>
    </div>
  );
}
