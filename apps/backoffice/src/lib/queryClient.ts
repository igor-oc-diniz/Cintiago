import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Centralized query keys — avoids loose strings scattered across the code.
// Grows phase by phase, alongside the catalog/orders entities.
export const QUERY_KEYS = {
  storeInfo: ["store", "info"] as const,
};
