import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectActiveOrder, setActiveOrder } from "@/store/slices/orderSlice";
import {
  selectCartItems,
  selectDeliveryType,
  selectPayment,
  selectChangeFor,
  clearCart,
  serializeCartToOrderPayload,
} from "@/store/slices/cartSlice";
import { pizzaItemCustomizations } from "@/utils/cart";
import { orderItemCustomLines } from "@/utils/order";
import { selectUser } from "@/store/slices/authSlice";
import { createOrder } from "@/api/orders";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import { formatPrice, formatEtaMinutes } from "@/utils/format";
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
  const changeFor = useAppSelector(selectChangeFor);
  const activeOrder = useAppSelector(selectActiveOrder);
  const { deliveryFee, addressLines } = useStoreInfo();

  const fee = deliveryType === "delivery" ? deliveryFee : 0;

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
      ...serializeCartToOrderPayload(items, payment.id, changeFor),
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
  const summaryItems: { headline: string; customLines: string[] }[] = order
    ? [
        ...(order.orderItems ?? []).map((item) => {
          const name =
            item.halves.length === 2
              ? `${item.halves[0].pizza.name} / ${item.halves[1].pizza.name}`
              : item.halves[0].pizza.name;
          return {
            headline: `${item.quantity}× ${name}`,
            customLines: orderItemCustomLines(item),
          };
        }),
        ...(order.orderProducts ?? []).map((p) => ({
          headline: `${p.quantity}× ${p.product.name}`,
          customLines: [],
        })),
      ]
    : [
        ...pizzaItems.map((item) => {
          const name =
            item.halves.length === 2
              ? `${item.halves[0].pizzaName} / ${item.halves[1].pizzaName}`
              : item.halves[0].pizzaName;
          return {
            headline: `${item.quantity}× ${name}`,
            customLines: pizzaItemCustomizations(item),
          };
        }),
        ...productItems.map((item) => ({
          headline: `${item.quantity}× ${item.productName}`,
          customLines: [],
        })),
      ];

  const deliveryLabel = deliveryType ? DELIVERY_LABELS[deliveryType] : null;
  const addressSub =
    deliveryType === "delivery" && order
      ? `${order.client.street}, ${order.client.number}`
      : (addressLines?.line1 ?? "");

  const paymentLabel = order?.payment.name ?? payment.name ?? "";

  const handleTrack = () => {
    if (order) navigate(`/order/${order.id}/tracking`);
  };

  const handleHome = () => navigate("/");

  // ETA real do pedido, calculado pelo backend (computeEta)
  const deliveryEta = formatEtaMinutes(order?.estimatedDeliveryMinutes ?? null);

  return {
    order,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    deliveryLabel,
    addressSub,
    paymentLabel,
    total: order ? Number(order.total ?? 0) : fee,
    fee,
    formatPrice,
    deliveryEta,
    handleTrack,
    handleHome,
    summaryItems,
  };
}

export type OrderConfirmData = ReturnType<typeof useOrderConfirm>;
