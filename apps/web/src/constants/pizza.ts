export type PizzaSize = "small" | "medium" | "large";

export const PIZZA_SIZE = {
  small: "small",
  medium: "medium",
  large: "large",
} as const;

// Indexados por string (o campo `size` vem dos DTOs como string livre).
export const SIZE_LABEL: Record<string, string> = {
  small: "Pequena",
  medium: "Média",
  large: "Grande",
};

export const SIZE_DESC: Record<string, string> = {
  small: "4 fatias · 25cm",
  medium: "6 fatias · 30cm",
  large: "8 fatias · 35cm",
};

export const SIZE_ORDER: readonly PizzaSize[] = ["small", "medium", "large"];

// Nome exibido quando uma metade não tem nome (fallback único).
export const PIZZA_NAME_FALLBACK = "Pizza";
