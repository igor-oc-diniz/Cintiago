import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import type { OrderStatus } from "@cintiago/shared";
import type { ActiveOrderCardProps } from "./types";

const SEGMENTS = 5;

interface ProgressStripProps {
  filled: number;
  delivered?: boolean;
}

function ProgressStrip({ filled, delivered }: ProgressStripProps) {
  const activeColor = delivered
    ? "var(--basil-500, #5A8F5A)"
    : "var(--terracotta-500)";
  const inactiveColor = delivered
    ? "var(--basil-100, #C8DEC8)"
    : "var(--terracotta-100)";

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        marginTop: 12,
        marginBottom: 4,
      }}
    >
      {Array.from({ length: SEGMENTS }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 99,
            background: i < filled ? activeColor : inactiveColor,
            transition: "background 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

export function ActiveOrderCard({
  order,
  progressSegment,
  getItemHeadlines,
  getStatusLabel,
  formatPrice,
  onTrack,
  onOpen,
}: ActiveOrderCardProps) {
  const filled = progressSegment(order.status as OrderStatus);
  const headlines = getItemHeadlines(order);
  const isDelivered = order.status === "delivered";
  const isCancelled = order.status === "cancelled";
  const isTerminal = isDelivered || isCancelled;

  const borderGradient = isDelivered
    ? "linear-gradient(135deg, var(--basil-400, #6B9E6B) 0%, var(--basil-600, #4A7A4A) 100%)"
    : isCancelled
      ? "var(--border)"
      : "linear-gradient(135deg, var(--terracotta-400) 0%, var(--terracotta-600) 100%)";

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
        style={{
          position: "relative",
          borderRadius: 16,
          padding: 2,
          background: borderGradient,
        }}
      >
        <div
          className="cg-card cg-grain"
          style={{
            borderRadius: 14,
            padding: "14px 16px 16px",
            position: "relative",
            overflow: "hidden",
          }}
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
                Pedido #{order.id}
              </span>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "var(--fg1)",
                  margin: "2px 0 4px",
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
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--fg3)",
                    }}
                  >
                    {" "}
                    +{headlines.length - 1}
                  </span>
                )}
              </p>
            </div>
            <Badge variant={order.status}>
              {getStatusLabel(order.status as OrderStatus)}
            </Badge>
          </div>

          <ProgressStrip filled={filled} delivered={isDelivered} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--fg3)",
              }}
            >
              {formatPrice(Number(order.total ?? 0))}
            </span>
            {!isTerminal && (
              <Button
                size="sm"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrack(order.id);
                }}
              >
                Acompanhar
              </Button>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
