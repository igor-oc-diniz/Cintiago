import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { formatPrice } from '@/utils/format'
import type { CartPizzaItem, CartProductItem } from '@/store/slices/cartSlice'

export const DELIVERY_FEE = 8.9

export const SIZE_LABELS: Record<string, string> = {
  small: 'Pequena',
  medium: 'Média',
  large: 'Grande',
}

export const DELIVERY_LABELS: Record<string, string> = {
  delivery: 'Delivery',
  pickup: 'Retirar no balcão',
  dine_in: 'Comer no salão',
}

export function pizzaItemLabel(item: CartPizzaItem): string {
  if (item.halves.length === 2) return `${item.halves[0].pizzaName} / ${item.halves[1].pizzaName}`
  return item.halves[0]?.pizzaName ?? 'Pizza'
}

export function pizzaItemSub(item: CartPizzaItem): string {
  const size = SIZE_LABELS[item.size] ?? item.size
  const crust = item.crustName ? ` · borda ${item.crustName.toLowerCase()}` : ''
  return `${size}${crust}`
}

export function pizzaItemCustomizations(item: CartPizzaItem): string[] {
  const parts: string[] = []
  for (const half of item.halves) {
    for (const ing of half.ingredients) {
      if (ing.action === 'remove') parts.push(`sem ${ing.ingredientName.toLowerCase()}`)
      else parts.push(`+ ${ing.ingredientName.toLowerCase()}`)
    }
  }
  return [...new Set(parts)]
}

export function useCartData() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const { items, subtotal, deliveryType, paymentName, updateQuantity, removeItem } = useCart()

  const pizzaItems = items.filter((i): i is CartPizzaItem => i.type === 'pizza')
  const productItems = items.filter((i): i is CartProductItem => i.type === 'product')
  const isEmpty = items.length === 0

  const fee = deliveryType === 'delivery' ? DELIVERY_FEE : 0
  const total = subtotal + fee
  const ready = !isEmpty && !!deliveryType && !!paymentName

  const deliveryLabel = deliveryType ? (DELIVERY_LABELS[deliveryType] ?? null) : null

  const handleQty = (id: string, v: number) => updateQuantity(id, v)
  const handleRemove = (id: string) => removeItem(id)

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
  }
}

export type CartData = ReturnType<typeof useCartData>
