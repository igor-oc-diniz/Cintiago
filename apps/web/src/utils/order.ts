import type { OrderDTO, PizzaSize } from "@cintiago/shared";

type OrderItem = OrderDTO["orderItems"][number];

function sizeKey(size: string): "priceSmall" | "priceMedium" | "priceLarge" {
  if (size === "small") return "priceSmall";
  if (size === "large") return "priceLarge";
  return "priceMedium";
}

/**
 * Recalcula o preço unitário atual de um item usando os DTOs aninhados no pedido,
 * com algoritmo idêntico ao backend: ingredientes acumulados por metade com
 * deduplicação cross-half, depois max das metades + borda.
 * Reflete preços vigentes mesmo que tenham mudado desde o pedido original.
 */
export function computeOrderItemCurrentPrice(item: OrderItem): number {
  const key = sizeKey(item.size);
  const chargedIngredients = new Set<number>();

  const halfPrices = item.halves.map((h) => {
    let halfPrice = Number(h.pizza[key] ?? 0);
    for (const ing of h.ingredients) {
      if (!chargedIngredients.has(ing.ingredientId)) {
        halfPrice += Number(ing.ingredient.ingredientPrice?.[key] ?? 0);
        chargedIngredients.add(ing.ingredientId);
      }
    }
    return halfPrice;
  });

  const pizzaPrice = halfPrices.length > 0 ? Math.max(...halfPrices) : 0;
  const crustPrice = item.crust ? Number(item.crust[key] ?? 0) : 0;

  return pizzaPrice + crustPrice;
}

/**
 * Linhas de customização de um item do pedido para exibição em resumos:
 * ingredientes extras adicionados (por metade, quando meia-a-meia) e a nota
 * de observações do item (ex: "sem cebola").
 */
export function orderItemCustomLines(item: OrderItem): string[] {
  const out: string[] = [];

  if (item.halves?.length) {
    const single = item.halves.length === 1;
    item.halves.forEach((h, i) => {
      const adds = h.ingredients.map(
        (ing) => `+ ${ing.ingredient.name.toLowerCase()}`,
      );
      if (!adds.length) return;
      const prefix = single ? "" : i === 0 ? "1ª metade · " : "2ª metade · ";
      out.push(prefix + adds.join(", "));
    });
  }

  if (item.notes) out.push(item.notes);

  return out;
}
