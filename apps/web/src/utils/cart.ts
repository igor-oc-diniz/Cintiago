import type { CartPizzaItem } from "@/store/slices/cartSlice";
import { SIZE_LABEL, PIZZA_NAME_FALLBACK } from "@/constants/pizza";

export function pizzaItemLabel(item: CartPizzaItem): string {
  if (item.halves.length === 2)
    return `${item.halves[0].pizzaName} / ${item.halves[1].pizzaName}`;
  return item.halves[0]?.pizzaName ?? PIZZA_NAME_FALLBACK;
}

export function pizzaItemSub(item: CartPizzaItem): string {
  const size = SIZE_LABEL[item.size] ?? item.size;
  const crust = item.crustName
    ? ` · borda ${item.crustName.toLowerCase()}`
    : "";
  return `${size}${crust}`;
}

export function pizzaItemCustomizations(item: CartPizzaItem): string[] {
  const parts: string[] = [];
  for (const half of item.halves) {
    for (const ing of half.ingredients) {
      parts.push(`+ ${ing.ingredientName.toLowerCase()}`);
    }
  }
  const unique = [...new Set(parts)];
  if (item.notes) unique.push(item.notes);
  return unique;
}
