import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "@/api/orders";
import { QUERY_KEYS } from "@/lib/queryClient";
import { formatPrice } from "@/utils/format";
import { SIZE_LABEL, PIZZA_NAME_FALLBACK } from "@/constants/pizza";
import { orderStatusLabel, progressSegment } from "@/constants/order";
import { ROUTES } from "@/constants/routes";
import { useRepeatOrder } from "@/hooks/useRepeatOrder";
import type { OrderDTO, OrderStatus } from "@cintiago/shared";

const ACTIVE_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "delivering",
  "delivered",
];

export function useMyOrders() {
  const navigate = useNavigate();
  const handleRepeat = useRepeatOrder();

  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.myOrders,
    queryFn: getMyOrders,
  });

  const activeOrders = orders.filter((o) =>
    ACTIVE_STATUSES.includes(o.status as OrderStatus),
  );

  const pastOrders = orders.filter(
    (o) => !ACTIVE_STATUSES.includes(o.status as OrderStatus),
  );

  const handleTrack = (orderId: number) =>
    navigate(ROUTES.orderTracking(orderId));

  const handleOpenDetail = (orderId: number) =>
    navigate(ROUTES.orderDetail(orderId));

  const handleOpenOrder = (orderId: number, status: OrderStatus) => {
    if (status === "delivered") {
      navigate(ROUTES.orderDetail(orderId));
    } else {
      navigate(ROUTES.orderTracking(orderId));
    }
  };

  const handleBack = () => navigate(ROUTES.home);

  const getItemHeadlines = (order: OrderDTO): string[] => [
    ...(order.orderItems ?? []).map((item) => {
      const name =
        item.halves.length === 2
          ? `${item.halves[0].pizza.name} / ${item.halves[1].pizza.name}`
          : (item.halves[0]?.pizza.name ?? PIZZA_NAME_FALLBACK);
      const size = SIZE_LABEL[item.size] ?? item.size;
      return `${item.quantity}× ${name} · ${size}`;
    }),
    ...(order.orderProducts ?? []).map(
      (p) => `${p.quantity}× ${p.product.name}`,
    ),
  ];

  const getStatusLabel = (status: OrderStatus): string =>
    orderStatusLabel(status);

  return {
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
  };
}

export type MyOrdersData = ReturnType<typeof useMyOrders>;
