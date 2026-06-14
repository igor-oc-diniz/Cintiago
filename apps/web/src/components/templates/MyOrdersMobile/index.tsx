import { Spinner } from "@/components/atoms/Spinner";
import { ShoppingBagIcon, RefreshCwIcon } from "@/components/atoms/Icons";
import { EmptyState } from "@/components/molecules/EmptyState";
import { PageHeader } from "@/components/molecules/PageHeader";
import { ActiveOrderCard } from "@/components/molecules/ActiveOrderCard";
import { PastOrderCard } from "@/components/molecules/PastOrderCard";
import type { MyOrdersData } from "@/hooks/useMyOrders";

export function MyOrdersMobile({
  activeOrders,
  pastOrders,
  isLoading,
  isError,
  refetch,
  formatPrice,
  progressSegment,
  getItemHeadlines,
  getStatusLabel,
  handleTrack,
  handleOpenDetail,
  handleOpenOrder,
  handleBack,
  handleRepeat,
}: MyOrdersData) {
  const isEmpty =
    !isLoading && activeOrders.length === 0 && pastOrders.length === 0;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg)",
        paddingBottom: 32,
      }}
    >
      <PageHeader
        title="Meus pedidos"
        onBack={handleBack}
        right={
          <button
            onClick={() => refetch()}
            aria-label="Atualizar pedidos"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            <RefreshCwIcon size={17} color="var(--fg2)" strokeWidth={2} />
          </button>
        }
      />

      {isLoading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: "80px 16px",
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
            Carregando seus pedidos…
          </p>
        </div>
      )}

      {isError && !isLoading && (
        <div
          style={{
            padding: "80px 32px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "var(--fg1)",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Não foi possível carregar os pedidos.
          </p>
          <button
            onClick={() => refetch()}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--terracotta-600)",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {isEmpty && (
        <EmptyState
          icon={<ShoppingBagIcon size={40} />}
          title="Nenhum pedido ainda"
          description="Seus pedidos aparecerão aqui após a primeira compra."
          action={{ label: "Ver o cardápio", onClick: handleBack }}
        />
      )}

      {!isLoading && !isError && (
        <div style={{ padding: "8px 16px 0" }}>
          {activeOrders.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--fg4)",
                  marginBottom: 10,
                }}
              >
                Em andamento
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {activeOrders.map((order) => (
                  <ActiveOrderCard
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
              </div>
            </section>
          )}

          {pastOrders.length > 0 && (
            <section>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--fg4)",
                  marginBottom: 10,
                }}
              >
                Histórico
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
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
            </section>
          )}
        </div>
      )}
    </div>
  );
}
