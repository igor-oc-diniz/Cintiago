import { api } from "./client";
import type { IngredientDTO } from "@cintiago/shared";
import type { Ingredient } from "@/types/domain";

// TODO: verify with backend — GET /ingredients does not return price or
// isVegetarian. These fields need a dedicated endpoint or inclusion in the
// ingredient response before they can be used for filtering/display.
function adaptIngredient(i: IngredientDTO): Ingredient {
  return {
    id: i.id,
    name: i.name,
    price: 0,
    isVegetarian: false,
  };
}

export const getIngredients = () =>
  api.get<IngredientDTO[]>("/ingredients").then((r) =>
    r.data.map(adaptIngredient),
  );
