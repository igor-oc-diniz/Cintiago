import type { CartPizzaItem } from "@/store/slices/cartSlice";

export const SIZE_LABELS: Record<string, string> = {
  small: "Pequena",
  medium: "Média",
  large: "Grande",
};

export function pizzaItemLabel(item: CartPizzaItem): string {
  if (item.halves.length === 2)
    return `${item.halves[0].pizzaName} / ${item.halves[1].pizzaName}`;
  return item.halves[0]?.pizzaName ?? "Pizza";
}

export function pizzaItemSub(item: CartPizzaItem): string {
  const size = SIZE_LABELS[item.size] ?? item.size;
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
