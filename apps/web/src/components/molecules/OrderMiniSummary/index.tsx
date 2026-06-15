import { SumLine } from "@/components/molecules/SumLine";
import { LeafIcon } from "@/components/atoms/Icons";
import { Divider } from "@/components/atoms/Divider";
import { formatPrice, SIZE_LABEL } from "@/utils/format";
import { orderItemCustomLines } from "@/utils/order";
import type { OrderDTO } from "@cintiago/shared";

interface OrderMiniSummaryProps {
  order: OrderDTO;
}

interface SummaryItem {
  headline: string;
  customLines: string[];
}

export function OrderMiniSummary({ order }: OrderMiniSummaryProps) {
  const items: SummaryItem[] = [
    ...order.orderItems.map((item) => {
      const name =
        item.halves.length === 2
          ? `${item.halves[0].pizza.name} / ${item.halves[1].pizza.name}`
          : (item.halves[0]?.pizza.name ?? "Pizza");
      const sizeLabel = SIZE_LABEL[item.size] ?? item.size;
      return {
        headline: `${item.quantity}× ${name} · ${sizeLabel}`,
        customLines: orderItemCustomLines(item),
      };
    }),
    ...order.orderProducts.map((p) => ({
      headline: `${p.quantity}× ${p.product.name}`,
      customLines: [],
    })),
  ];

  const isPickup = order.deliveryType === "pickup";
  const deliveryLabel = isPickup ? "Retirada" : "Delivery";
  const addressSub = isPickup
    ? "Retirar no balcão"
    : `${order.client.street}, ${order.client.number}`;

  return (
    <div
      className="cg-card cg-grain"
      style={{ padding: 16, position: "relative" }}
    >
      <LeafIcon
        size={15}
        color="var(--basil-300)"
        style={{
          position: "absolute",
          top: 14,
          right: 16,
          opacity: 0.75,
          strokeWidth: 1.8,
          zIndex: 3,
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 17,
            color: "var(--fg1)",
            marginBottom: 13,
          }}
        >
          Resumo do pedido
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SumLine
            label="Itens"
            value={
              <span>
                {items.map((it, i) => (
                  <span key={i} style={{ display: "block", marginBottom: 4 }}>
                    <span style={{ display: "block" }}>{it.headline}</span>
                    {it.customLines.map((line, j) => (
                      <span
                        key={j}
                        style={{
                          display: "block",
                          fontSize: 12.5,
                          color: "var(--fg3)",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            }
          />

          <Divider
            style={{
              borderStyle: "dashed",
              borderColor: "var(--terracotta-500)",
              opacity: 0.4,
            }}
          />

          <SumLine label="Pagamento" value={order.payment.name} />

          <SumLine
            label={deliveryLabel}
            value={deliveryLabel}
            sub={addressSub}
          />

          <Divider
            style={{
              borderStyle: "dashed",
              borderColor: "var(--terracotta-500)",
              opacity: 0.4,
            }}
          />

          <SumLine
            label="Total"
            value={formatPrice(Number(order.total ?? 0))}
            strong
          />
        </div>
      </div>
    </div>
  );
}
