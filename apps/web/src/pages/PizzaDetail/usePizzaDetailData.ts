import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPizzaById, getPizzas } from "@/api/pizzas";
import { getCrusts } from "@/api/crusts";
import { getIngredients } from "@/api/ingredients";
import { useCart } from "@/hooks/useCart";
import { QUERY_KEYS } from "@/lib/queryClient";
import type { Pizza, Ingredient, Crust } from "@/types/domain";

export function usePizzaDetailData() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addPizza } = useCart();

  const pizzaQuery = useQuery({
    queryKey: QUERY_KEYS.pizza(Number(id)),
    queryFn: () => getPizzaById(Number(id)),
  });
  const allPizzasQuery = useQuery({
    queryKey: QUERY_KEYS.pizzas,
    queryFn: getPizzas,
  });
  const crustsQuery = useQuery({
    queryKey: QUERY_KEYS.crusts,
    queryFn: getCrusts,
  });
  const ingredientsQuery = useQuery({
    queryKey: QUERY_KEYS.ingredients,
    queryFn: getIngredients,
  });

  const pizza: Pizza | undefined = pizzaQuery.data;
  const crusts: Crust[] = crustsQuery.data ?? [];
  const allIngredients: Ingredient[] = ingredientsQuery.data ?? [];
  const allPizzas: Pizza[] = allPizzasQuery.data ?? [];

  const [selectedSize, setSelectedSize] = useState<
    "small" | "medium" | "large"
  >("medium");
  const [selectedCrustId, setSelectedCrustId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [isMeia, setIsMeia] = useState(false);
  const [secondPizzaId, setSecondPizzaId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [removedIds, setRemovedIds] = useState<[number[], number[]]>([[], []]);
  const [addedIds, setAddedIds] = useState<[number[], number[]]>([[], []]);

  const secondPizza =
    isMeia && secondPizzaId
      ? (allPizzas.find((p) => p.id === secondPizzaId) ?? null)
      : null;

  const sizePrice =
    pizza?.prices.find((p) => p.size === selectedSize)?.price ?? 0;
  const secondSizePrice =
    secondPizza?.prices.find((p) => p.size === selectedSize)?.price ?? 0;
  const basePrice =
    isMeia && secondPizza ? Math.max(sizePrice, secondSizePrice) : sizePrice;

  const selectedCrust = crusts.find((c) => c.id === selectedCrustId);
  const crustPrice = selectedCrust?.additionalPrice ?? 0;

  const addedIngIds = new Set([...addedIds[0], ...addedIds[1]]);
  const addonsTotal = [...addedIngIds].reduce((sum, ingId) => {
    const ing = allIngredients.find((i) => i.id === ingId);
    return sum + (ing?.price ?? 0);
  }, 0);

  const unitPrice = basePrice + crustPrice + addonsTotal;
  const total = unitPrice * qty;

  const defaultIngs = pizza?.ingredients.filter((i) => i.price === 0) ?? [];
  const addonIngs = allIngredients.filter(
    (i) => i.price > 0 && !pizza?.ingredients.find((d) => d.id === i.id),
  );
  const secondDefaultIngs =
    secondPizza?.ingredients.filter((i) => i.price === 0) ?? [];
  const secondAddonIngs = addonIngs.filter(
    (i) => !secondPizza?.ingredients.find((d) => d.id === i.id),
  );

  const toggleRemoved = (half: 0 | 1, id: number) => {
    setRemovedIds((prev) => {
      const next: [number[], number[]] = [prev[0].slice(), prev[1].slice()];
      const idx = next[half].indexOf(id);
      if (idx >= 0) next[half].splice(idx, 1);
      else next[half].push(id);
      return next;
    });
  };

  const toggleAdded = (half: 0 | 1, id: number) => {
    setAddedIds((prev) => {
      const next: [number[], number[]] = [prev[0].slice(), prev[1].slice()];
      const idx = next[half].indexOf(id);
      if (idx >= 0) next[half].splice(idx, 1);
      else next[half].push(id);
      return next;
    });
  };

  const enableMeia = () => {
    setIsMeia(true);
    setSheetOpen(true);
  };
  const disableMeia = () => {
    setIsMeia(false);
    setSecondPizzaId(null);
    setRemovedIds((prev) => [prev[0], []]);
    setAddedIds((prev) => [prev[0], []]);
  };

  const handleAddToCart = () => {
    if (!pizza) return;
    const halves =
      isMeia && secondPizza
        ? [
            {
              pizzaId: pizza.id,
              pizzaName: pizza.name,
              half: 1 as const,
              ingredients: [
                ...removedIds[0].map((ingredientId) => ({
                  ingredientId,
                  ingredientName:
                    pizza.ingredients.find((i) => i.id === ingredientId)
                      ?.name ?? "",
                  action: "remove" as const,
                })),
                ...addedIds[0].map((ingredientId) => ({
                  ingredientId,
                  ingredientName:
                    allIngredients.find((i) => i.id === ingredientId)?.name ??
                    "",
                  action: "add" as const,
                })),
              ],
            },
            {
              pizzaId: secondPizza.id,
              pizzaName: secondPizza.name,
              half: 2 as const,
              ingredients: [
                ...removedIds[1].map((ingredientId) => ({
                  ingredientId,
                  ingredientName:
                    secondPizza.ingredients.find((i) => i.id === ingredientId)
                      ?.name ?? "",
                  action: "remove" as const,
                })),
                ...addedIds[1].map((ingredientId) => ({
                  ingredientId,
                  ingredientName:
                    allIngredients.find((i) => i.id === ingredientId)?.name ??
                    "",
                  action: "add" as const,
                })),
              ],
            },
          ]
        : [
            {
              pizzaId: pizza.id,
              pizzaName: pizza.name,
              half: 1 as const,
              ingredients: [
                ...removedIds[0].map((ingredientId) => ({
                  ingredientId,
                  ingredientName:
                    pizza.ingredients.find((i) => i.id === ingredientId)
                      ?.name ?? "",
                  action: "remove" as const,
                })),
                ...addedIds[0].map((ingredientId) => ({
                  ingredientId,
                  ingredientName:
                    allIngredients.find((i) => i.id === ingredientId)?.name ??
                    "",
                  action: "add" as const,
                })),
              ],
            },
          ];

    addPizza({
      size: selectedSize,
      crustId: selectedCrustId,
      crustName: selectedCrust?.name ?? null,
      halves,
      unitPrice,
    });
    navigate(-1);
  };

  return {
    isLoading: pizzaQuery.isLoading,
    pizza,
    crusts,
    allIngredients,
    allPizzas,
    selectedSize,
    setSelectedSize,
    selectedCrustId,
    setSelectedCrustId,
    qty,
    setQty,
    isMeia,
    setIsMeia,
    secondPizzaId,
    setSecondPizzaId,
    sheetOpen,
    setSheetOpen,
    removedIds,
    addedIds,
    secondPizza,
    basePrice,
    crustPrice,
    addonsTotal,
    unitPrice,
    total,
    defaultIngs,
    addonIngs,
    secondDefaultIngs,
    secondAddonIngs,
    toggleRemoved,
    toggleAdded,
    enableMeia,
    disableMeia,
    handleAddToCart,
    navigate,
  };
}

export type PizzaDetailData = ReturnType<typeof usePizzaDetailData>;
