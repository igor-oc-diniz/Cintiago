import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { MapPinIcon } from "@/components/atoms/Icons";
import type { OrderStatus } from "@cintiago/shared";
import type { ActiveOrderCardDesktopProps } from "./types";

const STAGE_LABELS: Record<string, string> = {
  pending: "Recebido",
  confirmed: "Confirmado",
  preparing: "Em preparo",
  delivering: "A caminho",
  delivered: "Entregue",
};

const SEGMENTS = [
  "pending",
  "confirmed",
  "preparing",
  "delivering",
  "delivered",
] as const;

export function ActiveOrderCardDesktop({
  order,
  progressSegment,
  getItemHeadlines,
  getStatusLabel,
  formatPrice,
  onTrack,
  onOpen,
}: ActiveOrderCardDesktopProps) {
  const filled = progressSegment(order.status as OrderStatus);
  const headlines = getItemHeadlines(order);
  const itemsText = headlines.join(" · ");

  return (
    <div
      className="cg-card cg-grain"
      onClick={() => onOpen(order.id)}
      role="button"
      aria-label={`Pedido #${order.id} em andamento`}
      style={{
        padding: 24,
        cursor: "pointer",
        boxShadow:
          "inset 0 0 0 2px var(--primary, #C0522A), 0 0 8px 1px rgba(192,82,42,0.1), 0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 28,
          alignItems: "center",
        }}
      >
        {/* Left */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body, sans-serif)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--primary, #C0522A)",
              }}
            >
              Pedido em andamento
            </span>
            <Badge variant={order.status}>
              {getStatusLabel(order.status as OrderStatus)}
            </Badge>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span
              style={{
                fontFamily: "var(--font-display, serif)",
                fontWeight: 700,
                fontSize: 30,
                color: "var(--fg1, #1A1410)",
                letterSpacing: "-0.01em",
                flexShrink: 0,
              }}
            >
              #{order.id}
            </span>
          </div>

          <div
            style={{
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: 15,
              color: "var(--fg2, #3A2E24)",
              marginTop: 7,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {itemsText}
          </div>

          {/* Progress strip with labels */}
          <div
            style={{ display: "flex", gap: 6, marginTop: 18, maxWidth: 440 }}
          >
            {SEGMENTS.map((seg, i) => (
              <div key={seg} style={{ flex: 1 }}>
                <div
                  style={{
                    height: 5,
                    borderRadius: 999,
                    background:
                      i < filled
                        ? "var(--primary, #C0522A)"
                        : "var(--border-strong, #D4C8B8)",
                    transition: "background 0.3s ease",
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-body, sans-serif)",
                    fontSize: 11,
                    color:
                      i === filled - 1
                        ? "var(--primary, #C0522A)"
                        : "var(--fg4, #B0A090)",
                    fontWeight: i === filled - 1 ? 600 : 500,
                    marginTop: 6,
                    lineHeight: 1.2,
                  }}
                >
                  {STAGE_LABELS[seg]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 14,
            flexShrink: 0,
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "var(--font-body, sans-serif)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--fg4, #B0A090)",
              }}
            >
              Entrega
            </div>
            <div
              style={{
                fontFamily: "var(--font-body, sans-serif)",
                fontSize: 14,
                color: "var(--fg3, #7A6A5A)",
                marginTop: 4,
              }}
            >
              {formatPrice(Number(order.total ?? 0))}
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              onTrack(order.id);
            }}
          >
            <MapPinIcon size={16} />
            Acompanhar
          </Button>
        </div>
      </div>
    </div>
  );
}
