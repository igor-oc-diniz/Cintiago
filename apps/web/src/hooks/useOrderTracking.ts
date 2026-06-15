import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { addPizza, addProduct, clearCart } from "@/store/slices/cartSlice";
import { getOrderById } from "@/api/orders";
import { QUERY_KEYS } from "@/lib/queryClient";
import {
  formatPrice,
  formatEtaMinutes,
  ORDER_STATUS_LABEL,
  SIZE_LABEL,
  telHref,
} from "@/utils/format";
import { orderItemCustomLines } from "@/utils/order";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import type { OrderDTO, OrderStatus } from "@cintiago/shared";
import type { ReactNode } from "react";
import {
  ReceiptIcon,
  FlameIcon,
  BikeIcon,
  CircleCheckBigIcon,
} from "@/components/atoms/Icons";
import { createElement } from "react";

// ─── Timeline ────────────────────────────────────────────────────────────────

export interface TrackingStage {
  key: string;
  label: string;
  icon: ReactNode;
}

function buildStages(): TrackingStage[] {
  return [
    {
      key: "pending",
      label: "Aguardando confirmação",
      icon: createElement(ReceiptIcon, { size: 17, strokeWidth: 1.9 }),
    },
    {
      key: "confirmed",
      label: "Confirmado",
      icon: createElement(ReceiptIcon, { size: 17, strokeWidth: 1.9 }),
    },
    {
      key: "preparing",
      label: "Em preparo",
      icon: createElement(FlameIcon, { size: 17, strokeWidth: 1.9 }),
    },
    {
      key: "delivering",
      label: "Saiu para entrega",
      icon: createElement(BikeIcon, { size: 17, strokeWidth: 1.9 }),
    },
    {
      key: "delivered",
      label: "Entregue",
      icon: createElement(CircleCheckBigIcon, {
        size: 17,
        strokeWidth: 1.9,
      }),
    },
  ];
}

// Maps API status → timeline active index (0-based)
function progressIndex(status: OrderStatus): number {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "preparing":
      return 2;
    case "delivering":
      return 3;
    case "delivered":
      return 4;
    default:
      return 0;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useOrderTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const orderId = Number(id);
  const { phone } = useStoreInfo();

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.order(orderId),
    queryFn: () => getOrderById(orderId),
    refetchInterval: 30_000,
    enabled: !isNaN(orderId),
  });

  const stages = buildStages();
  const activeIndex = order ? progressIndex(order.status) : 0;
  const isDelivered = order?.status === "delivered";

  const statusLabel = order
    ? (ORDER_STATUS_LABEL[order.status] ?? order.status)
    : "";

  const deliveryEta = formatEtaMinutes(order?.estimatedDeliveryMinutes ?? null);

  const handleBack = () => navigate("/orders");

  const handleContact = () => {
    if (phone) window.location.href = telHref(phone);
  };

  const handleRepeat = (order: OrderDTO) => {
    dispatch(clearCart());

    for (const item of order.orderItems) {
      dispatch(
        addPizza({
          size: item.size as "small" | "medium" | "large",
          crustId: item.crustId,
          crustName: item.crust?.name ?? null,
          halves: item.halves.map((h) => ({
            pizzaId: h.pizzaId,
            pizzaName: h.pizza.name,
            half: h.half as 1 | 2,
            ingredients: h.ingredients.map((ing) => ({
              ingredientId: ing.ingredientId,
              ingredientName: ing.ingredient.name,
            })),
          })),
          notes: item.notes,
          quantity: item.quantity,
          unitPrice: Number(item.price ?? 0),
        }),
      );
    }

    for (const p of order.orderProducts) {
      dispatch(
        addProduct({
          productId: p.productId,
          productName: p.product.name,
          unitPrice: Number(p.product.price),
        }),
      );
    }

    navigate("/cart");
  };

  const summaryItems: { headline: string; customLines: string[] }[] = order
    ? [
        ...order.orderItems.map((item) => {
          const name =
            item.halves.length === 2
              ? `${item.halves[0].pizza.name} / ${item.halves[1].pizza.name}`
              : (item.halves[0]?.pizza.name ?? "Pizza");
          const size = SIZE_LABEL[item.size] ?? item.size;
          return {
            headline: `${item.quantity}× ${name} · ${size}`,
            customLines: orderItemCustomLines(item),
          };
        }),
        ...order.orderProducts.map((p) => ({
          headline: `${p.quantity}× ${p.product.name}`,
          customLines: [],
        })),
      ]
    : [];

  return {
    order,
    isLoading,
    isError,
    stages,
    activeIndex,
    isDelivered,
    statusLabel,
    deliveryEta,
    formatPrice,
    handleBack,
    handleContact,
    handleRepeat,
    summaryItems,
  };
}

export type OrderTrackingData = ReturnType<typeof useOrderTracking>;
