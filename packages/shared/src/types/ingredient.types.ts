export interface IngredientDTO {
  id: number;
  name: string;
  category: string | null;
  createdAt: string;
  ingredientPrice?: {
    priceSmall: string | null;
    priceMedium: string | null;
    priceLarge: string | null;
  } | null;
}
