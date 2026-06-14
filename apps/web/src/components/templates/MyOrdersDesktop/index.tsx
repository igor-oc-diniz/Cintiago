import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { WebNav } from "@/components/molecules/WebNav";
import { ActiveOrderCardDesktop } from "@/components/molecules/ActiveOrderCardDesktop";
import { PastOrderCard } from "@/components/molecules/PastOrderCard";
import { EmptyState } from "@/components/molecules/EmptyState";
import { RefreshCwIcon, ReceiptIcon } from "@/components/atoms/Icons";
import type { MyOrdersDesktopProps } from "./types";

export function MyOrdersDesktop({
  activeOrders,
  pastOrders,
  isLoading,
  refetch,
  formatPrice,
  progressSegment,
  getItemHeadlines,
  getStatusLabel,
  handleTrack,
  handleOpenDetail,
  handleOpenOrder,
  handleRepeat,
}: MyOrdersDesktopProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const isEmpty = activeOrders.length === 0 && pastOrders.length === 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #F5EFE6)" }}>
      <WebNav
        active="orders"
        userName={user?.name ?? ""}
        userEmail={user?.email ?? ""}
        userInitials={(user?.name ?? "U").slice(0, 2).toUpperCase()}
        onHome={() => navigate("/")}
        onOrders={() => navigate("/orders")}
        onProfile={() => navigate("/profile")}
      />

      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "40px 36px 80px",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: 26,
          }}
        >
          <div>
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
              Sua conta
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
              Meus pedidos
            </h1>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing || isLoading}
            style={{
              height: 44,
              padding: "0 18px",
              borderRadius: 999,
              cursor: refreshing ? "default" : "pointer",
              border: "1px solid var(--border-strong, #D4C8B8)",
              background: "var(--surface, #FFFFFF)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-body, sans-serif)",
              fontWeight: 600,
              fontSize: 14,
              color: "var(--fg2, #3A2E24)",
            }}
          >
            <RefreshCwIcon
              size={16}
              color="var(--fg3, #7A6A5A)"
              style={
                refreshing
                  ? { animation: "spin 900ms linear infinite" }
                  : undefined
              }
            />
            {refreshing ? "Atualizando…" : "Atualizar status"}
          </button>
        </div>

        {isEmpty ? (
          <div className="cg-card" style={{ borderRadius: 16 }}>
            <EmptyState
              icon={<ReceiptIcon size={38} color="var(--fg4, #B0A090)" />}
              title="Você ainda não fez nenhum pedido."
              description="Quando o forno acender por você, seus pedidos aparecem aqui."
              action={{ label: "Ver o cardápio", onClick: () => navigate("/") }}
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Active orders */}
            {activeOrders.map((order) => (
              <ActiveOrderCardDesktop
                key={order.id}
                order={order}
                progressSegment={progressSegment}
                getItemHeadlines={getItemHeadlines}
                getStatusLabel={getStatusLabel}
                formatPrice={formatPrice}
                onTrack={handleTrack}
                onOpen={(id) => handleOpenOrder(id, order.status)}
              />
            ))}

            {/* Past orders */}
            {pastOrders.length > 0 && (
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body, sans-serif)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--fg4, #B0A090)",
                    marginBottom: 14,
                  }}
                >
                  Pedidos anteriores
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 20,
                  }}
                >
                  {pastOrders.map((order) => (
                    <PastOrderCard
                      key={order.id}
                      order={order}
                      getItemHeadlines={getItemHeadlines}
                      getStatusLabel={getStatusLabel}
                      formatPrice={formatPrice}
                      onOpen={handleOpenDetail}
                      onRepeat={handleRepeat}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
