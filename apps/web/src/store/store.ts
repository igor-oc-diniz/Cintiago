// store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice"; // crie depois
import orderReducer from "./slices/orderSlice"; // crie depois

const migrations = {
  // v1 → v2: introduziu paymentType; limpa pagamento para forçar re-seleção
  2: (state: Record<string, unknown>) => {
    const cart = state.cart as Record<string, unknown> | undefined;
    if (!cart) return state;
    return {
      ...state,
      cart: {
        ...cart,
        paymentId: null,
        paymentName: null,
        paymentType: null,
        changeFor: null,
      },
    };
  },
  // v2 → v3: entrega e pagamento não devem vir pré-selecionados de sessões
  // anteriores — são sempre escolha consciente do usuário a cada pedido.
  3: (state: Record<string, unknown>) => {
    const cart = state.cart as Record<string, unknown> | undefined;
    if (!cart) return state;
    return {
      ...state,
      cart: {
        ...cart,
        deliveryType: null,
        paymentId: null,
        paymentName: null,
        paymentType: null,
        changeFor: null,
      },
    };
  },
};

// Só o carrinho persiste — auth e order são sempre derivados da sessão/API
const persistConfig = {
  key: "cart",
  version: 3,
  storage,
  whitelist: ["cart"],
  migrate: createMigrate(migrations, { debug: false }),
};

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  order: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist despacha actions não-serializáveis internamente — ignorar
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
