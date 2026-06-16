import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { addPizza, addProduct, clearCart } from "@/store/slices/cartSlice";
import { ROUTES } from "@/constants/routes";
import { computeOrderItemCurrentPrice } from "@/utils/order";
import type { OrderDTO } from "@cintiago/shared";

/**
 * Repete um pedido: limpa o carrinho, recria pizzas e produtos a partir do
 * pedido informado e navega para o carrinho. Lógica compartilhada por
 * `useMyOrders`, `useOrderDetail` e `useOrderTracking`.
 */
export function useRepeatOrder() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (order: OrderDTO) => {
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
}
