import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/utils/format";
import type { CartPizzaItem, CartProductItem } from "@/store/slices/cartSlice";
import { DELIVERY_FEE } from "@/constants/delivery";

const DELIVERY_LABELS: Record<string, string> = {
  delivery: "Delivery",
  pickup: "Retirar no balcão",
  dine_in: "Comer no salão",
};

export function useCartData() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const {
    items,
    subtotal,
    deliveryType,
    paymentName,
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

  const fee = deliveryType === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + fee;
  const ready = !isEmpty && !!deliveryType && !!paymentName;

  const deliveryLabel = deliveryType
    ? (DELIVERY_LABELS[deliveryType] ?? null)
    : null;

  const handleQty = (id: string, v: number) => updateQuantity(id, v);
  const handleRemove = (id: string) => removeItem(id);

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
    ready,
    formatPrice,
    handleQty,
    handleRemove,
  };
}

export type CartData = ReturnType<typeof useCartData>;
