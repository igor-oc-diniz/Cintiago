import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPizzaById, getPizzas } from "@/api/pizzas";
import { getCrusts } from "@/api/crusts";
import { getIngredients } from "@/api/ingredients";
import { useCart } from "@/hooks/useCart";
import { useAppDispatch } from "@/store/hooks";
import { updatePizzaItem } from "@/store/slices/cartSlice";
import { QUERY_KEYS } from "@/lib/queryClient";
import type { Pizza, Ingredient, Crust } from "@/types/domain";
import type { CartPizzaItem } from "@/store/slices/cartSlice";

export function usePizzaDetailData() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { addPizza } = useCart();

  const editItem =
    (location.state as { item?: CartPizzaItem } | null)?.item ?? null;
  const isEditMode = editItem !== null;

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
  >(editItem?.size ?? "medium");
  const [selectedCrustId, setSelectedCrustId] = useState<number | null>(
    editItem?.crustId ?? null,
  );
  const [qty, setQty] = useState(editItem?.quantity ?? 1);
  const [isMeia, setIsMeia] = useState(
    isEditMode && editItem!.halves.length === 2,
  );
  const [secondPizzaId, setSecondPizzaId] = useState<number | null>(
    editItem?.halves[1]?.pizzaId ?? null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<[number[], number[]]>(
    editItem
      ? [
          editItem.halves[0]?.ingredients.map((i) => i.ingredientId) ?? [],
          editItem.halves[1]?.ingredients.map((i) => i.ingredientId) ?? [],
        ]
      : [[], []],
  );
  const [notes, setNotes] = useState(editItem?.notes ?? "");

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
    setAddedIds((prev) => [prev[0], []]);
  };

  const handleAddToCart = () => {
    if (!pizza) return;

    const addedIngredients = (half: 0 | 1) =>
      addedIds[half].map((ingredientId) => ({
        ingredientId,
        ingredientName:
          allIngredients.find((i) => i.id === ingredientId)?.name ?? "",
      }));

    const halves =
      isMeia && secondPizza
        ? [
            {
              pizzaId: pizza.id,
              pizzaName: pizza.name,
              half: 1 as const,
              ingredients: addedIngredients(0),
            },
            {
              pizzaId: secondPizza.id,
              pizzaName: secondPizza.name,
              half: 2 as const,
              ingredients: addedIngredients(1),
            },
          ]
        : [
            {
              pizzaId: pizza.id,
              pizzaName: pizza.name,
              half: 1 as const,
              ingredients: addedIngredients(0),
            },
          ];

    if (isEditMode && editItem) {
      dispatch(
        updatePizzaItem({
          id: editItem.id,
          size: selectedSize,
          crustId: selectedCrustId,
          crustName: selectedCrust?.name ?? null,
          halves,
          notes: notes || null,
          quantity: qty,
          unitPrice,
        }),
      );
    } else {
      addPizza({
        size: selectedSize,
        crustId: selectedCrustId,
        crustName: selectedCrust?.name ?? null,
        halves,
        notes,
        quantity: qty,
        unitPrice,
      });
    }
    navigate(-1);
  };

  return {
    isLoading: pizzaQuery.isLoading,
    isEditMode,
    confirmLabel: isEditMode ? "Atualizar" : "Adicionar ao carrinho",
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
    addedIds,
    notes,
    setNotes,
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
    toggleAdded,
    enableMeia,
    disableMeia,
    handleAddToCart,
    navigate,
  };
}

export type PizzaDetailData = ReturnType<typeof usePizzaDetailData>;
