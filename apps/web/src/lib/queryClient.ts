import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // dados do cardápio ficam frescos por 5 min
      gcTime: 1000 * 60 * 10, // cache mantido por 10 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Chaves de query centralizadas — evita strings soltas espalhadas pelo código
export const QUERY_KEYS = {
  pizzas: ["pizzas"] as const,
  pizza: (id: number) => ["pizzas", id] as const,
  products: ["products"] as const,
  ingredients: ["ingredients"] as const,
  crusts: ["crusts"] as const,
  payments: ["payments"] as const,
  myOrders: ["orders", "my"] as const,
  order: (id: number) => ["orders", id] as const,
  myProfile: ["clients", "me"] as const,
  storeInfo: ["store", "info"] as const,
};
