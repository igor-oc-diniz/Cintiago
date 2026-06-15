import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartCount,
  selectDeliveryType,
  selectPayment,
  selectChangeFor,
  selectPaymentType,
  addPizza,
  addProduct,
  updateQuantity,
  removeItem,
  setDelivery,
  setPayment,
  setChangeFor,
  clearCart,
} from "@/store/slices/cartSlice";
import type {
  AddPizzaPayload,
  AddProductPayload,
} from "@/store/slices/cartSlice";

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const count = useAppSelector(selectCartCount);
  const deliveryType = useAppSelector(selectDeliveryType);
  const payment = useAppSelector(selectPayment);
  const changeFor = useAppSelector(selectChangeFor);
  const paymentType = useAppSelector(selectPaymentType);

  return {
    items,
    subtotal,
    count,
    deliveryType,
    paymentId: payment.id,
    paymentName: payment.name,
    paymentType,
    changeFor,
    addPizza: (payload: AddPizzaPayload) => dispatch(addPizza(payload)),
    addProduct: (payload: AddProductPayload) => dispatch(addProduct(payload)),
    updateQuantity: (id: string, quantity: number) =>
      dispatch(updateQuantity({ id, quantity })),
    removeItem: (id: string) => dispatch(removeItem(id)),
    setDelivery: (type: "delivery" | "pickup" | "dine_in") =>
      dispatch(setDelivery({ type })),
    setPayment: (id: number, name: string, type?: string) =>
      dispatch(setPayment({ id, name, type })),
    setChangeFor: (value: number | null) => dispatch(setChangeFor(value)),
    clearCart: () => dispatch(clearCart()),
  };
}
