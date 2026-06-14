import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { LeafIcon } from "@/components/atoms/Icons";
import type { OrderStatus } from "@cintiago/shared";
import type { ActiveOrderCardProps } from "./types";

const SEGMENTS = 4;

interface ProgressStripProps {
  filled: number;
}

function ProgressStrip({ filled }: ProgressStripProps) {
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
            background:
              i < filled ? "var(--terracotta-500)" : "var(--terracotta-100)",
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
          background:
            "linear-gradient(135deg, var(--terracotta-400) 0%, var(--terracotta-600) 100%)",
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
          <LeafIcon
            size={42}
            color="var(--terracotta-100)"
            style={{
              position: "absolute",
              bottom: -6,
              right: -4,
              opacity: 0.5,
              strokeWidth: 1.2,
              transform: "rotate(-20deg)",
              pointerEvents: "none",
            }}
          />

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

          <ProgressStrip filled={filled} />

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
          </div>
        </div>
      </div>
    </button>
  );
}
