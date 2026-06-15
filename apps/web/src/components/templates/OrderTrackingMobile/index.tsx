import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Divider } from "@/components/atoms/Divider";
import { Spinner } from "@/components/atoms/Spinner";
import {
  ClockIcon,
  CircleCheckBigIcon,
  PhoneIcon,
  RotateCcwIcon,
} from "@/components/atoms/Icons";
import { PageHeader } from "@/components/molecules/PageHeader";
import { TimelineStep } from "@/components/molecules/TimelineStep";
import { OrderMiniSummary } from "@/components/molecules/OrderMiniSummary";
import type { OrderTrackingData } from "@/hooks/useOrderTracking";

export function OrderTrackingMobile({
  order,
  isLoading,
  isError,
  stages,
  activeIndex,
  isDelivered,
  handleBack,
  handleContact,
  handleRepeat,
}: OrderTrackingData) {
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
          Carregando acompanhamento…
        </p>
      </div>
    );
  }

  if (isError || !order) {
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
          Não foi possível carregar o pedido.
        </p>
        <Button variant="ghost" onClick={handleBack}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      <PageHeader
        onBack={handleBack}
        eyebrow={`Pedido #${order.id}`}
        title="Acompanhe seu pedido"
      />

      <div
        className="cg-noscroll"
        style={{ flex: 1, overflowY: "auto", padding: "6px 16px 0" }}
      >
        {/* Remaining-time banner */}
        <div
          className="cg-card cg-grain"
          style={{
            padding: "16px 18px",
            position: "relative",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: "var(--radius-md)",
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                background: "var(--primary-soft)",
              }}
            >
              {isDelivered ? (
                <CircleCheckBigIcon size={22} color="var(--primary)" />
              ) : (
                <ClockIcon size={22} color="var(--primary)" />
              )}
            </span>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--fg4)",
                  marginBottom: 2,
                }}
              >
                {isDelivered ? "Pedido concluído" : "Previsão de entrega"}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "var(--fg1)",
                  lineHeight: 1.1,
                }}
              >
                {isDelivered ? "Entregue" : "30–45 min"}
              </div>
            </div>

            <Badge variant={order.status} className="flex-none" />
          </div>
        </div>

        {/* Timeline */}
        <div
          className="cg-card cg-grain"
          style={{ padding: "18px 18px", position: "relative" }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 17,
                color: "var(--fg1)",
                marginBottom: 16,
              }}
            >
              Andamento
            </div>

            {stages.map((stage, i) => {
              const state =
                i < activeIndex
                  ? "done"
                  : i === activeIndex
                    ? isDelivered
                      ? "done"
                      : "active"
                    : "todo";

              return (
                <TimelineStep
                  key={stage.key}
                  icon={stage.icon}
                  label={stage.label}
                  state={state}
                  isLast={i === stages.length - 1}
                />
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div style={{ marginTop: 20 }}>
          <Divider
            style={{
              borderStyle: "dashed",
              borderColor: "var(--terracotta-500)",
              opacity: 0.4,
              marginBottom: 16,
            }}
          />
          <OrderMiniSummary order={order} />
        </div>

        {/* Cancel link */}
        <div style={{ textAlign: "center", padding: "20px 8px 4px" }}>
          <button
            onClick={handleContact}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--fg3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Precisa cancelar?{" "}
            <span style={{ color: "var(--primary)", fontWeight: 600 }}>
              Entre em contato
            </span>
            <PhoneIcon size={13} color="var(--primary)" />
          </button>
        </div>

        <div style={{ height: isDelivered ? 168 : 28 }} />
      </div>

      {/* Footer — repeat only when delivered */}
      {isDelivered && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 25,
            padding: "14px 16px calc(20px + 16px)",
            background:
              "color-mix(in oklab, var(--parchment) 90%, transparent)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 -1px 0 var(--border)",
          }}
        >
          <Button
            variant="primary"
            fullWidth
            onClick={() => handleRepeat(order)}
            style={{ height: 54, borderRadius: "var(--radius-lg)" }}
          >
            <RotateCcwIcon size={18} />
            Repetir pedido
          </Button>
        </div>
      )}
    </div>
  );
}
