import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { addPizza, addProduct, clearCart } from "@/store/slices/cartSlice";
import { getOrderById } from "@/api/orders";
import { QUERY_KEYS } from "@/lib/queryClient";
import { formatPrice, ORDER_STATUS_LABEL, SIZE_LABEL } from "@/utils/format";
import type { OrderDTO, OrderStatus } from "@cintiago/shared";

export interface RatingPayload {
  stars: number;
  comment: string;
}

export function useOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const orderId = Number(id);

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.order(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: !isNaN(orderId),
  });

  // TODO: backend gap — POST /orders/:id/rating não existe ainda.
  // Usando estado local para simular o envio da avaliação até o endpoint ser criado.
  const [localRating, setLocalRating] = useState<RatingPayload | null>(null);

  const isDelivered = order?.status === "delivered";
  const isDelivery = true; // TODO: backend gap — OrderDTO não expõe deliveryType; assumindo delivery.

  const statusLabel = order
    ? (ORDER_STATUS_LABEL[order.status] ?? order.status)
    : "";

  const handleBack = () => navigate("/orders");

  const handleContact = () => {
    window.location.href = "tel:+551130612200";
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
              action: ing.action as "add" | "remove",
            })),
          })),
          unitPrice: 0,
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

  const handleRate = (payload: RatingPayload) => {
    setLocalRating(payload);
    // TODO: backend gap — when POST /orders/:id/rating is available,
    // replace with a useMutation call and invalidate QUERY_KEYS.order(orderId).
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

  const getItemCustomLines = (
    item: OrderDTO["orderItems"][number],
  ): string[] => {
    if (!item.halves?.length) return [];
    const single = item.halves.length === 1;
    const out: string[] = [];

    item.halves.forEach((h, i) => {
      const adds = h.ingredients
        .filter((ing) => ing.action === "add")
        .map((ing) => `+ ${ing.ingredient.name.toLowerCase()}`);
      const removes = h.ingredients
        .filter((ing) => ing.action === "remove")
        .map((ing) => `sem ${ing.ingredient.name.toLowerCase()}`);
      const parts = [...removes, ...adds];
      if (!parts.length) return;
      const prefix = single ? "" : i === 0 ? "1ª metade · " : "2ª metade · ";
      out.push(prefix + parts.join(", "));
    });

    return out;
  };

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
    localRating,
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
