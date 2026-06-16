import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectActiveOrder, setActiveOrder } from "@/store/slices/orderSlice";
import {
  selectCartItems,
  selectCartSubtotal,
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
import { DELIVERY_LABEL } from "@/constants/delivery";
import { ROUTES } from "@/constants/routes";
import type { CartPizzaItem, CartProductItem } from "@/store/slices/cartSlice";

export function useOrderConfirm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const deliveryType = useAppSelector(selectDeliveryType);
  const payment = useAppSelector(selectPayment);
  const changeFor = useAppSelector(selectChangeFor);
  const activeOrder = useAppSelector(selectActiveOrder);
  const { deliveryFee, addressLines } = useStoreInfo();

  // Snapshot do carrinho capturado antes do clearCart() limpar o Redux.
  // deliveryType e fee são zerados pelo clearCart, mas precisamos deles para exibição.
  const cartSnapshot = useRef<{
    deliveryType: string;
    subtotal: number;
  } | null>(null);

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

    cartSnapshot.current = {
      deliveryType,
      subtotal,
    };

    // clientId é resolvido pelo backend via JWT — não enviado no body
    const payload = {
      ...serializeCartToOrderPayload(items, payment.id, changeFor),
      deliveryType: deliveryType as "delivery" | "pickup",
    };

    mutation.mutate(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const order = activeOrder ?? mutation.data ?? null;

  // Após clearCart(), deliveryType do Redux é null — usar snapshot capturado antes da mutation.
  // deliveryFee vem de useStoreInfo (staleTime: Infinity = sempre em cache), seguro usar direto.
  const effectiveDeliveryType =
    cartSnapshot.current?.deliveryType ?? deliveryType;
  const effectiveFee = effectiveDeliveryType === "delivery" ? deliveryFee : 0;

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

  const deliveryLabel = effectiveDeliveryType
    ? DELIVERY_LABEL[effectiveDeliveryType]
    : null;
  const addressSub =
    effectiveDeliveryType === "delivery" && order
      ? `${order.client.street}, ${order.client.number}`
      : (addressLines?.line1 ?? "");

  const paymentLabel = order?.payment.name ?? payment.name ?? "";

  const handleTrack = () => {
    if (order) navigate(ROUTES.orderTracking(order.id));
  };

  const handleHome = () => navigate(ROUTES.home);

  // ETA real do pedido, calculado pelo backend (computeEta)
  const deliveryEta = formatEtaMinutes(order?.estimatedDeliveryMinutes ?? null);

  return {
    order,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    deliveryLabel,
    addressSub,
    paymentLabel,
    // order.total já inclui a taxa de entrega (calculada no backend).
    // O fallback pré-resposta soma effectiveFee ao subtotal do carrinho.
    total: order
      ? Number(order.total ?? 0)
      : (cartSnapshot.current?.subtotal ?? subtotal) + effectiveFee,
    fee: effectiveFee,
    formatPrice,
    deliveryEta,
    handleTrack,
    handleHome,
    summaryItems,
  };
}

export type OrderConfirmData = ReturnType<typeof useOrderConfirm>;
