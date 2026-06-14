import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { WebNav } from "@/components/molecules/WebNav";
import { HTimeline } from "@/components/molecules/HTimeline";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import {
  ArrowLeftIcon,
  ClockIcon,
  CircleCheckBigIcon,
  PhoneIcon,
  RotateCcwIcon,
  LeafIcon,
} from "@/components/atoms/Icons";
import type { OrderTrackingDesktopProps } from "./types";
import type { OrderStatus } from "@cintiago/shared";

function SummaryRow({
  label,
  value,
  sub,
  strong,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  strong?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body, sans-serif)",
          fontWeight: 500,
          fontSize: 13.5,
          color: "var(--fg3, #7A6A5A)",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span style={{ textAlign: "right", minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontFamily: strong
              ? "var(--font-display, serif)"
              : "var(--font-body, sans-serif)",
            fontWeight: strong ? 700 : 600,
            fontSize: strong ? 22 : 14,
            color: "var(--fg1, #1A1410)",
          }}
        >
          {value}
        </span>
        {sub && (
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: 12.5,
              color: "var(--fg4, #B0A090)",
              marginTop: 2,
            }}
          >
            {sub}
          </span>
        )}
      </span>
    </div>
  );
}

export function OrderTrackingDesktop({
  order,
  isLoading,
  isError,
  stages,
  activeIndex,
  isDelivered,
  statusLabel,
  formatPrice,
  handleBack,
  handleContact,
  handleRepeat,
  itemHeadlines,
}: OrderTrackingDesktopProps) {
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

  const hTimelineStages = stages.map((s) => ({
    key: s.key,
    label: s.label,
    icon: s.icon,
  }));

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
        {/* Back link */}
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

        {/* Page title */}
        <div style={{ marginBottom: 28 }}>
          <span
            style={{
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--fg4, #B0A090)",
            }}
          >
            Pedido #{order.id}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display, serif)",
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: "-0.01em",
              color: "var(--fg1, #1A1410)",
              margin: "4px 0 0",
            }}
          >
            Acompanhe seu pedido
          </h1>
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
            {/* Remaining banner */}
            <div className="cg-card cg-grain" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "var(--radius-lg, 12px)",
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    background: "var(--primary-soft, rgba(192,82,42,0.1))",
                  }}
                >
                  {isDelivered ? (
                    <CircleCheckBigIcon
                      size={26}
                      color="var(--primary, #C0522A)"
                    />
                  ) : (
                    <ClockIcon size={26} color="var(--primary, #C0522A)" />
                  )}
                </span>
                <div style={{ minWidth: 0 }}>
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
                    {isDelivered ? "Pedido concluído" : "Previsão de entrega"}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display, serif)",
                      fontWeight: 700,
                      fontSize: 26,
                      color: "var(--fg1, #1A1410)",
                      marginTop: 2,
                      lineHeight: 1.05,
                    }}
                  >
                    {isDelivered ? "Entregue" : "Em andamento"}
                  </div>
                </div>
                <span style={{ marginLeft: "auto", flexShrink: 0 }}>
                  <Badge variant={order.status as OrderStatus}>
                    {statusLabel}
                  </Badge>
                </span>
              </div>
            </div>

            {/* Horizontal timeline */}
            <div
              className="cg-card cg-grain"
              style={{ padding: "28px 28px 26px" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display, serif)",
                  fontWeight: 600,
                  fontSize: 19,
                  color: "var(--fg1, #1A1410)",
                  marginBottom: 26,
                }}
              >
                Andamento
              </div>
              <HTimeline
                stages={hTimelineStages}
                activeIndex={activeIndex}
                isDelivered={isDelivered}
              />
            </div>

            {/* Contact */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                padding: "4px 0",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body, sans-serif)",
                  fontSize: 14,
                  color: "var(--fg3, #7A6A5A)",
                }}
              >
                Precisa cancelar?
              </span>
              <button
                onClick={handleContact}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-body, sans-serif)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--primary, #C0522A)",
                }}
              >
                Entre em contato
                <PhoneIcon size={14} color="var(--primary, #C0522A)" />
              </button>
            </div>
          </div>

          {/* RIGHT — sticky summary */}
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
                Resumo
              </div>
              <LeafIcon
                size={16}
                color="var(--basil-300, #A8C5A0)"
                style={{ opacity: 0.75 }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <SummaryRow
                label="Itens"
                value={
                  <span>
                    {itemHeadlines.map((h, i) => (
                      <span key={i} style={{ display: "block" }}>
                        {h}
                      </span>
                    ))}
                  </span>
                }
              />
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--border, #E8E0D0)",
                  margin: 0,
                }}
              />
              <SummaryRow
                label="Pagamento"
                value={order.payment?.name ?? "—"}
              />
              <SummaryRow
                label="Entrega"
                value="Delivery"
                sub={`${order.client?.street ?? ""}, ${order.client?.number ?? ""}`}
              />
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--border, #E8E0D0)",
                  margin: 0,
                }}
              />
              <SummaryRow
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
