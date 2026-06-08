import { api } from "./client";
import type { PizzaDTO } from "@cintiago/shared";
import type { Pizza } from "@/types/domain";

function adaptPizza(p: PizzaDTO): Pizza {
  const prices = [
    { size: "small" as const, price: Number(p.priceSmall ?? 0) },
    { size: "medium" as const, price: Number(p.priceMedium ?? 0) },
    { size: "large" as const, price: Number(p.priceLarge ?? 0) },
  ];

  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    imageUrl: null,
    ingredients: [],
    prices,
    isVegetarian: false,
    isNew: false,
  };
}

export const getPizzas = () =>
  api.get<PizzaDTO[]>("/pizzas").then((r) => r.data.map(adaptPizza));

export const getPizzaById = (id: number) =>
  api.get<PizzaDTO>(`/pizzas/${id}`).then((r) => adaptPizza(r.data));
