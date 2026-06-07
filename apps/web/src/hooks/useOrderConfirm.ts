import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectActiveOrder, setActiveOrder } from "@/store/slices/orderSlice";
import {
  selectCartItems,
  selectDeliveryType,
  selectPayment,
  clearCart,
  serializeCartToOrderPayload,
} from "@/store/slices/cartSlice";
import { selectUser } from "@/store/slices/authSlice";
import { createOrder } from "@/api/orders";
import { DELIVERY_FEE, DELIVERY_ETA, PIZZERIA } from "@/constants/delivery";
import { formatPrice } from "@/utils/format";
import type { CartPizzaItem, CartProductItem } from "@/store/slices/cartSlice";

const DELIVERY_LABELS: Record<string, string> = {
  delivery: "Delivery",
  pickup: "Retirada no local",
  dine_in: "Comer no salão",
};

export function useOrderConfirm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  const items = useAppSelector(selectCartItems);
  const deliveryType = useAppSelector(selectDeliveryType);
  const payment = useAppSelector(selectPayment);
  const activeOrder = useAppSelector(selectActiveOrder);

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const fee = deliveryType === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + fee;

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      dispatch(setActiveOrder(order));
      dispatch(clearCart());
    },
  });

  // Fire order creation once when the page mounts, only if no active order yet
  useEffect(() => {
    if (activeOrder) return;
    if (!user || !payment.id || !deliveryType) return;
    if (items.length === 0) return;

    // clientId é resolvido pelo backend via JWT — não enviado no body
    const payload = {
      ...serializeCartToOrderPayload(items, payment.id),
      deliveryType: deliveryType as "delivery" | "pickup",
    };

    mutation.mutate(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const order = activeOrder ?? mutation.data ?? null;

  const pizzaItems = items.filter(
    (i): i is CartPizzaItem => i.type === "pizza",
  );
  const productItems = items.filter(
    (i): i is CartProductItem => i.type === "product",
  );

  // Build human-readable item lines from the confirmed order (preferred) or
  // from the cart snapshot still in state during the loading phase.
  const itemLines: string[] = order
    ? [
        ...(order.orderItems ?? []).map((item) => {
          const name =
            item.halves.length === 2
              ? `${item.halves[0].pizza.name} / ${item.halves[1].pizza.name}`
              : item.halves[0].pizza.name;
          return `${item.quantity}× ${name}`;
        }),
        ...(order.orderProducts ?? []).map((p) => `${p.quantity}× ${p.product.name}`),
      ]
    : [
        ...pizzaItems.map((item) => {
          const name =
            item.halves.length === 2
              ? `${item.halves[0].pizzaName} / ${item.halves[1].pizzaName}`
              : item.halves[0].pizzaName;
          return `${item.quantity}× ${name}`;
        }),
        ...productItems.map((item) => `${item.quantity}× ${item.productName}`),
      ];

  const deliveryLabel = deliveryType ? DELIVERY_LABELS[deliveryType] : null;
  const addressSub =
    order?.deliveryType === "delivery"
      ? `${order.client.street}, ${order.client.number}`
      : PIZZERIA.address;

  const paymentLabel = order?.payment.name ?? payment.name ?? "";

  const handleTrack = () => {
    if (order) navigate(`/order/${order.id}/tracking`);
  };

  const handleHome = () => navigate("/");

  return {
    order,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    itemLines,
    deliveryLabel,
    addressSub,
    paymentLabel,
    total,
    fee,
    formatPrice,
    DELIVERY_ETA,
    handleTrack,
    handleHome,
  };
}

export type OrderConfirmData = ReturnType<typeof useOrderConfirm>;
