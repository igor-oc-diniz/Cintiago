import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { addPizza, addProduct, clearCart } from "@/store/slices/cartSlice";
import { getOrderById, rateOrder } from "@/api/orders";
import { QUERY_KEYS } from "@/lib/queryClient";
import {
  formatPrice,
  ORDER_STATUS_LABEL,
  SIZE_LABEL,
  telHref,
} from "@/utils/format";
import {
  computeOrderItemCurrentPrice,
  orderItemCustomLines,
} from "@/utils/order";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import type { OrderDTO } from "@cintiago/shared";

export function useOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClientInstance = useQueryClient();

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

  const statusLabel = order
    ? (ORDER_STATUS_LABEL[order.status] ?? order.status)
    : "";

  const handleBack = () => navigate("/orders");

  const handleContact = () => {
    if (phone) window.location.href = telHref(phone);
  };

  const handleRepeat = (o: OrderDTO) => {
    dispatch(clearCart());

    for (const item of o.orderItems) {
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
          unitPrice: computeOrderItemCurrentPrice(item),
        }),
      );
    }

    for (const p of o.orderProducts ?? []) {
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
          : (item.halves[0]?.pizza.name ?? "Pizza");
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
