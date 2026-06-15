import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import { useAppDispatch } from "@/store/hooks";
import { clearActiveOrder } from "@/store/slices/orderSlice";
import { formatPrice } from "@/utils/format";
import type { CartPizzaItem, CartProductItem } from "@/store/slices/cartSlice";

const DELIVERY_LABELS: Record<string, string> = {
  delivery: "Delivery",
  pickup: "Retirar no balcão",
  dine_in: "Comer no salão",
};

export function useCartData() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAuth();
  const { deliveryFee, minOrderValue, openingHours, fetchFreshStatus } =
    useStoreInfo();
  const {
    items,
    subtotal,
    deliveryType,
    paymentName,
    paymentType,
    changeFor,
    updateQuantity,
    removeItem,
  } = useCart();

  const pizzaItems = items.filter(
    (i): i is CartPizzaItem => i.type === "pizza",
  );
  const productItems = items.filter(
    (i): i is CartProductItem => i.type === "product",
  );
  const isEmpty = items.length === 0;

  const fee = deliveryType === "delivery" ? deliveryFee : 0;
  const total = subtotal + fee;

  // Pedido mínimo do estabelecimento (quando configurado) sobre o subtotal
  const meetsMinimum = minOrderValue == null || subtotal >= minOrderValue;
  const ready = !isEmpty && !!deliveryType && !!paymentName && meetsMinimum;

  const deliveryLabel = deliveryType
    ? (DELIVERY_LABELS[deliveryType] ?? null)
    : null;

  // Mensagem única do que falta para finalizar — mínimo tem prioridade.
  // Segue a ordem do fluxo (entrega → pagamento), pois o pagamento só é
  // habilitado após a entrega; o label avança conforme o usuário progride.
  const checkoutHint = !meetsMinimum
    ? `Pedido mínimo de ${formatPrice(minOrderValue!)} — faltam ${formatPrice(minOrderValue! - subtotal)}`
    : !deliveryType
      ? "Escolha a forma de entrega"
      : !paymentName
        ? "Escolha a forma de pagamento"
        : null;

  const handleQty = (id: string, v: number) => updateQuantity(id, v);
  const handleRemove = (id: string) => removeItem(id);

  // Estado do modal "loja fechada" + verificação no clique de finalizar
  const [showClosedModal, setShowClosedModal] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const handleCheckout = async () => {
    if (checkingStatus) return;
    setCheckingStatus(true);
    try {
      const open = await fetchFreshStatus();
      if (open) {
        dispatch(clearActiveOrder());
        navigate("/order/confirm");
      } else {
        setShowClosedModal(true);
      }
    } catch {
      // falha na consulta não deve travar o usuário — segue para a confirmação
      dispatch(clearActiveOrder());
      navigate("/order/confirm");
    } finally {
      setCheckingStatus(false);
    }
  };

  const closeClosedModal = () => setShowClosedModal(false);

  const isCash = paymentType === "CASH";

  return {
    navigate,
    isLoggedIn,
    pizzaItems,
    productItems,
    isEmpty,
    subtotal,
    deliveryType,
    paymentName,
    deliveryLabel,
    fee,
    total,
    changeFor,
    isCash,
    ready,
    checkoutHint,
    formatPrice,
    handleQty,
    handleRemove,
    handleCheckout,
    checkingStatus,
    showClosedModal,
    closeClosedModal,
    openingHours,
  };
}

export type CartData = ReturnType<typeof useCartData>;
