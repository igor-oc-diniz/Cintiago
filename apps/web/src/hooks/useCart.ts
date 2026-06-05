import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartCount,
  addPizza,
  addProduct,
  updateQuantity,
  removeItem,
  clearCart,
} from '@/store/slices/cartSlice'
import type { AddPizzaPayload, AddProductPayload } from '@/store/slices/cartSlice'

export function useCart() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)
  const count = useAppSelector(selectCartCount)

  return {
    items,
    subtotal,
    count,
    addPizza: (payload: AddPizzaPayload) => dispatch(addPizza(payload)),
    addProduct: (payload: AddProductPayload) => dispatch(addProduct(payload)),
    updateQuantity: (id: string, quantity: number) =>
      dispatch(updateQuantity({ id, quantity })),
    removeItem: (id: string) => dispatch(removeItem(id)),
    clearCart: () => dispatch(clearCart()),
  }
}
