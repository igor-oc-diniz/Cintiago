import type { OrderDTO } from "@cintiago/shared";

type OrderItem = OrderDTO["orderItems"][number];

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
