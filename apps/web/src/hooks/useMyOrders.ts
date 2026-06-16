import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { addPizza, addProduct, clearCart } from "@/store/slices/cartSlice";
import { getMyOrders } from "@/api/orders";
import { QUERY_KEYS } from "@/lib/queryClient";
import { formatPrice } from "@/utils/format";
import { SIZE_LABEL, PIZZA_NAME_FALLBACK } from "@/constants/pizza";
import { orderStatusLabel, progressSegment } from "@/constants/order";
import { ROUTES } from "@/constants/routes";
import { computeOrderItemCurrentPrice } from "@/utils/order";
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
          unitPrice: computeOrderItemCurrentPrice(item),
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

    navigate(ROUTES.cart);
  };

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
