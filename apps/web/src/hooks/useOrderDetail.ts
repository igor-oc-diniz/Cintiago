import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById, rateOrder } from "@/api/orders";
import { QUERY_KEYS } from "@/lib/queryClient";
import { formatPrice, telHref } from "@/utils/format";
import { SIZE_LABEL, PIZZA_NAME_FALLBACK } from "@/constants/pizza";
import { orderStatusLabel } from "@/constants/order";
import { ROUTES } from "@/constants/routes";
import {
  computeOrderItemCurrentPrice,
  orderItemCustomLines,
} from "@/utils/order";
import { useRepeatOrder } from "@/hooks/useRepeatOrder";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import type { OrderDTO } from "@cintiago/shared";

export function useOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClientInstance = useQueryClient();
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
    enabled: !isNaN(orderId),
  });

  const { mutate: submitRating } = useMutation({
    mutationFn: (payload: { stars: number; comment?: string }) =>
      rateOrder(orderId, payload),
    onSuccess: () => {
      queryClientInstance.invalidateQueries({
        queryKey: QUERY_KEYS.order(orderId),
      });
    },
  });

  const isDelivered = order?.status === "delivered";
  const isDelivery = order?.deliveryType === "delivery";

  const itemsTotal = order
    ? (order.orderItems ?? []).reduce(
        (acc, item) => acc + computeOrderItemCurrentPrice(item) * item.quantity,
        0,
      ) +
      (order.orderProducts ?? []).reduce(
        (acc, p) => acc + Number(p.product.price ?? 0) * p.quantity,
        0,
      )
    : 0;

  const derivedSubtotal =
    order?.subtotal != null ? Number(order.subtotal) : itemsTotal;

  const derivedDeliveryFee =
    order?.deliveryFee != null
      ? Number(order.deliveryFee)
      : isDelivery
        ? Math.max(0, Number(order?.total ?? 0) - derivedSubtotal)
        : 0;

  const statusLabel = order ? orderStatusLabel(order.status) : "";

  const handleBack = () => navigate(ROUTES.myOrders);

  const handleContact = () => {
    if (phone) window.location.href = telHref(phone);
  };

  const handleRate = (payload: { stars: number; comment: string }) => {
    submitRating({
      stars: payload.stars,
      comment: payload.comment || undefined,
    });
  };

  const getItemHeadlines = (o: OrderDTO): string[] => [
    ...(o.orderItems ?? []).map((item) => {
      const name =
        item.halves.length === 2
          ? `${item.halves[0].pizza.name} / ${item.halves[1].pizza.name}`
          : (item.halves[0]?.pizza.name ?? PIZZA_NAME_FALLBACK);
      const size = SIZE_LABEL[item.size] ?? item.size;
      return `${item.quantity}× ${name} · ${size}`;
    }),
    ...(o.orderProducts ?? []).map((p) => `${p.quantity}× ${p.product.name}`),
  ];

  const getItemCustomLines = (item: OrderDTO["orderItems"][number]): string[] =>
    orderItemCustomLines(item);

  const getItemSubtitle = (
    item: OrderDTO["orderItems"][number],
  ): string | null => {
    return item.crust ? `Borda ${item.crust.name.toLowerCase()}` : null;
  };

  return {
    order,
    isLoading,
    isError,
    isDelivered,
    isDelivery,
    statusLabel,
    existingRating: order?.rating ?? null,
    derivedSubtotal,
    derivedDeliveryFee,
    formatPrice,
    handleBack,
    handleContact,
    handleRepeat,
    handleRate,
    getItemHeadlines,
    getItemCustomLines,
    getItemSubtitle,
  };
}

export type OrderDetailData = ReturnType<typeof useOrderDetail>;
