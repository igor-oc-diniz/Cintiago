import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ChevronRightIcon } from "@/components/atoms/Icons";
import { formatDate } from "@/utils/format";
import type { OrderStatus } from "@cintiago/shared";
import type { PastOrderCardProps } from "./types";

export function PastOrderCard({
  order,
  getItemHeadlines,
  getStatusLabel,
  formatPrice,
  onOpen,
  onRepeat,
}: PastOrderCardProps) {
  const headlines = getItemHeadlines(order);
  const isDelivered = order.status === "delivered";

  return (
    <button
      onClick={() => onOpen(order.id)}
      aria-label={`Pedido #${order.id}`}
      style={{
        width: "100%",
        textAlign: "left",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
    >
      <div
        className="cg-card"
        style={{ padding: "14px 16px", borderRadius: 14 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--fg4)",
                }}
              >
                #{order.id}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--fg4)",
                }}
              >
                ·
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--fg4)",
                }}
              >
                {formatDate(order.createdAt)}
              </span>
            </div>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 15,
                color: "var(--fg1)",
                margin: "0 0 6px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {headlines[0] ?? "Pedido"}
              {headlines.length > 1 && (
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--fg3)",
                  }}
                >
                  {" "}
                  +{headlines.length - 1}
                </span>
              )}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Badge variant={order.status}>
                {getStatusLabel(order.status as OrderStatus)}
              </Badge>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--fg2)",
                }}
              >
                {formatPrice(Number(order.total ?? 0))}
              </span>
            </div>
          </div>

          <ChevronRightIcon
            size={18}
            color="var(--fg4)"
            style={{ flexShrink: 0, marginTop: 2 }}
          />
        </div>

        {isDelivered && (
          <div style={{ marginTop: 12 }}>
            <Button
              size="sm"
              variant="secondary"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onRepeat(order);
              }}
            >
              Repetir pedido
            </Button>
          </div>
        )}
      </div>
    </button>
  );
}
