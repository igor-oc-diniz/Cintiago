import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { addPizza, addProduct, clearCart } from "@/store/slices/cartSlice";
import { getMyOrders } from "@/api/orders";
import { QUERY_KEYS } from "@/lib/queryClient";
import { formatPrice, ORDER_STATUS_LABEL, SIZE_LABEL } from "@/utils/format";
import type { OrderDTO, OrderStatus } from "@cintiago/shared";

const ACTIVE_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "delivering",
  "delivered",
];

export function progressSegment(status: OrderStatus): number {
  switch (status) {
    case "pending":
      return 1;
    case "confirmed":
      return 2;
    case "delivering":
      return 3;
    case "delivered":
      return 4;
    default:
      return 0;
  }
}

export function useMyOrders() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
    navigate(`/order/${orderId}/tracking`);

  const handleOpenDetail = (orderId: number) => navigate(`/orders/${orderId}`);

  const handleOpenOrder = (orderId: number, status: OrderStatus) => {
    if (status === "delivered") {
      navigate(`/orders/${orderId}`);
    } else {
      navigate(`/order/${orderId}/tracking`);
    }
  };

  const handleBack = () => navigate("/");

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
              action: ing.action as "add" | "remove",
            })),
          })),
          unitPrice: 0,
        }),
      );
    }

    for (const p of order.orderProducts ?? []) {
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

  const getItemHeadlines = (order: OrderDTO): string[] => [
    ...(order.orderItems ?? []).map((item) => {
      const name =
        item.halves.length === 2
          ? `${item.halves[0].pizza.name} / ${item.halves[1].pizza.name}`
          : (item.halves[0]?.pizza.name ?? "Pizza");
      const size = SIZE_LABEL[item.size] ?? item.size;
      return `${item.quantity}× ${name} · ${size}`;
    }),
    ...(order.orderProducts ?? []).map(
      (p) => `${p.quantity}× ${p.product.name}`,
    ),
  ];

  const getStatusLabel = (status: OrderStatus): string =>
    ORDER_STATUS_LABEL[status] ?? status;

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
