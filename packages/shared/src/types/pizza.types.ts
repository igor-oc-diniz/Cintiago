export interface PizzaDTO {
  id: number;
  name: string;
  description: string | null;
  priceSmall: string | null;
  priceMedium: string | null;
  priceLarge: string | null;
  active: boolean;
  createdAt: string;
}
