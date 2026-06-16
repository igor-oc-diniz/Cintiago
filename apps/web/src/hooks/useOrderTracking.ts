import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "@/api/orders";
import { QUERY_KEYS } from "@/lib/queryClient";
import { formatPrice, formatEtaMinutes, telHref } from "@/utils/format";
import { SIZE_LABEL, PIZZA_NAME_FALLBACK } from "@/constants/pizza";
import {
  ORDER_STATUS,
  orderStatusLabel,
  progressIndex,
} from "@/constants/order";
import { ROUTES } from "@/constants/routes";
import { orderItemCustomLines } from "@/utils/order";
import { useRepeatOrder } from "@/hooks/useRepeatOrder";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import type { OrderStatus } from "@cintiago/shared";
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

// Ícones da timeline por status (os rótulos vêm de ORDER_STATUS.trackingLabel).
const STAGE_ICONS: Record<string, ReactNode> = {
  pending: createElement(ReceiptIcon, { size: 17, strokeWidth: 1.9 }),
  confirmed: createElement(ReceiptIcon, { size: 17, strokeWidth: 1.9 }),
  preparing: createElement(FlameIcon, { size: 17, strokeWidth: 1.9 }),
  delivering: createElement(BikeIcon, { size: 17, strokeWidth: 1.9 }),
  delivered: createElement(CircleCheckBigIcon, { size: 17, strokeWidth: 1.9 }),
};

const STAGE_KEYS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "delivering",
  "delivered",
];

function buildStages(): TrackingStage[] {
  return STAGE_KEYS.map((key) => ({
    key,
    label: ORDER_STATUS[key].trackingLabel,
    icon: STAGE_ICONS[key],
  }));
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useOrderTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const handleRepeat = useRepeatOrder();

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

  const statusLabel = order ? orderStatusLabel(order.status) : "";

  const deliveryEta = formatEtaMinutes(order?.estimatedDeliveryMinutes ?? null);

  const handleBack = () => navigate(ROUTES.myOrders);

  const handleContact = () => {
    if (phone) window.location.href = telHref(phone);
  };

  const summaryItems: { headline: string; customLines: string[] }[] = order
    ? [
        ...order.orderItems.map((item) => {
          const name =
            item.halves.length === 2
              ? `${item.halves[0].pizza.name} / ${item.halves[1].pizza.name}`
              : (item.halves[0]?.pizza.name ?? PIZZA_NAME_FALLBACK);
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
