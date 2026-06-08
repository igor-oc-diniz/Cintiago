import { api } from "./client";
import type { IngredientDTO } from "@cintiago/shared";
import type { Ingredient } from "@/types/domain";

function adaptIngredient(i: IngredientDTO): Ingredient {
  return {
    id: i.id,
    name: i.name,
    price: Number(i.ingredientPrice?.priceMedium ?? 0),
    isVegetarian: false,
  };
}

export const getIngredients = () =>
  api
    .get<IngredientDTO[]>("/ingredients")
    .then((r) => r.data.map(adaptIngredient));
