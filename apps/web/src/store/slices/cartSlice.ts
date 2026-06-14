// store/slices/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ─── Tipos do domínio ────────────────────────────────────────────────────────

export type Size = "small" | "medium" | "large";

export interface IngredientOverride {
  ingredientId: number;
  ingredientName: string; // só para exibição — não vai para a API
}

export interface PizzaHalf {
  pizzaId: number;
  pizzaName: string; // só para exibição
  half: 1 | 2;
  ingredients: IngredientOverride[];
}

/** Um item de pizza no carrinho (pode ter 1 ou 2 metades) */
export interface CartPizzaItem {
  id: string; // uuid local — não existe na API, é para gerenciar o carrinho
  type: "pizza";
  size: Size;
  crustId: number | null;
  crustName: string | null;
  quantity: number;
  halves: PizzaHalf[]; // sempre 1 ou 2 elementos
  notes: string | null; // observações do item (ex: "sem cebola") — texto livre
  unitPrice: number; // calculado no frontend para exibição
}

/** Um produto avulso no carrinho (bebida, sobremesa, etc.) */
export interface CartProductItem {
  id: string; // uuid local
  type: "product";
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export type CartItem = CartPizzaItem | CartProductItem;

interface CartState {
  items: CartItem[];
  subtotal: number;
  deliveryType: "delivery" | "pickup" | "dine_in" | null;
  paymentId: number | null;
  paymentName: string | null;
}

// ─── Payload de actions ──────────────────────────────────────────────────────

export interface AddPizzaPayload {
  size: Size;
  crustId: number | null;
  crustName: string | null;
  halves: PizzaHalf[];
  notes?: string | null;
  quantity?: number;
  unitPrice: number;
}

export interface AddProductPayload {
  productId: number;
  productName: string;
  unitPrice: number;
}

interface UpdateQuantityPayload {
  id: string;
  quantity: number;
}

interface UpdateHalfIngredientsPayload {
  itemId: string;
  half: 1 | 2;
  ingredients: IngredientOverride[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Slice ───────────────────────────────────────────────────────────────────

const initialState: CartState = {
  items: [],
  subtotal: 0,
  deliveryType: null,
  paymentId: null,
  paymentName: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addPizza(state, action: PayloadAction<AddPizzaPayload>) {
      const { size, crustId, crustName, halves, notes, quantity, unitPrice } =
        action.payload;
      const normalizedNotes = notes?.trim() ? notes.trim() : null;
      const addQty = quantity && quantity > 0 ? quantity : 1;

      // Se já existe item idêntico (mesmas metades, tamanho, borda e notas), só incrementa
      const existing = state.items.find(
        (item): item is CartPizzaItem =>
          item.type === "pizza" &&
          item.size === size &&
          item.crustId === crustId &&
          item.notes === normalizedNotes &&
          item.halves.length === halves.length &&
          item.halves.every((h, i) => h.pizzaId === halves[i]?.pizzaId),
      );

      if (existing) {
        existing.quantity += addQty;
      } else {
        state.items.push({
          id: generateId(),
          type: "pizza",
          size,
          crustId,
          crustName,
          quantity: addQty,
          halves,
          notes: normalizedNotes,
          unitPrice,
        });
      }

      state.subtotal = calcSubtotal(state.items);
    },

    addProduct(state, action: PayloadAction<AddProductPayload>) {
      const { productId, productName, unitPrice } = action.payload;

      const existing = state.items.find(
        (item): item is CartProductItem =>
          item.type === "product" && item.productId === productId,
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          id: generateId(),
          type: "product",
          productId,
          productName,
          quantity: 1,
          unitPrice,
        });
      }

      state.subtotal = calcSubtotal(state.items);
    },

    updateQuantity(state, action: PayloadAction<UpdateQuantityPayload>) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (!item) return;

      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        item.quantity = quantity;
      }

      state.subtotal = calcSubtotal(state.items);
    },

    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.subtotal = calcSubtotal(state.items);
    },

    /** Permite editar os ingredientes de uma metade específica já no carrinho */
    updateHalfIngredients(
      state,
      action: PayloadAction<UpdateHalfIngredientsPayload>,
    ) {
      const { itemId, half, ingredients } = action.payload;
      const item = state.items.find(
        (i): i is CartPizzaItem => i.type === "pizza" && i.id === itemId,
      );
      if (!item) return;

      const pizzaHalf = item.halves.find((h) => h.half === half);
      if (pizzaHalf) {
        pizzaHalf.ingredients = ingredients;
      }
    },

    setDelivery(
      state,
      action: PayloadAction<{ type: CartState["deliveryType"] }>,
    ) {
      state.deliveryType = action.payload.type;
    },

    setPayment(state, action: PayloadAction<{ id: number; name: string }>) {
      state.paymentId = action.payload.id;
      state.paymentName = action.payload.name;
    },

    clearCart(state) {
      state.items = [];
      state.subtotal = 0;
      state.deliveryType = null;
      state.paymentId = null;
      state.paymentName = null;
    },
  },
});

export const {
  addPizza,
  addProduct,
  updateQuantity,
  removeItem,
  updateHalfIngredients,
  setDelivery,
  setPayment,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────

import type { RootState } from "../store";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartSubtotal = (state: RootState) => state.cart.subtotal;
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectDeliveryType = (state: RootState) => state.cart.deliveryType;
export const selectPayment = (state: RootState) => ({
  id: state.cart.paymentId,
  name: state.cart.paymentName,
});

// ─── Serialização para POST /orders ──────────────────────────────────────────
//
// Converte o estado do carrinho para o payload exato que a API espera.
// Chamado no thunk de checkout, não dentro do slice.
//
// Payload esperado pela API:
// {
//   clientId: number,
//   paymentId: number,
//   items: [
//     {
//       size: string,
//       crustId?: number,
//       quantity: number,
//       notes?: string,
//       halves: [
//         { pizzaId: number, half: 1|2, ingredients?: [{ ingredientId }] }
//       ]
//     }
//   ],
//   products: [{ productId: number, quantity: number }]
// }

export function serializeCartToOrderPayload(
  items: CartItem[],
  paymentId: number,
) {
  const pizzaItems = items.filter(
    (i): i is CartPizzaItem => i.type === "pizza",
  );
  const productItems = items.filter(
    (i): i is CartProductItem => i.type === "product",
  );

  return {
    paymentId,
    items: pizzaItems.map((item) => ({
      size: item.size,
      ...(item.crustId ? { crustId: item.crustId } : {}),
      quantity: item.quantity,
      ...(item.notes ? { notes: item.notes } : {}),
      halves: item.halves.map((h) => ({
        pizzaId: h.pizzaId,
        half: h.half,
        // Só inclui ingredients se houver adicionais — a API aceita sem o campo
        ...(h.ingredients.length > 0
          ? {
              ingredients: h.ingredients.map(({ ingredientId }) => ({
                ingredientId,
              })),
            }
          : {}),
      })),
    })),
    products: productItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  };
}
