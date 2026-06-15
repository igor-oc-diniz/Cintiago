import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStoreInfo } from "@/api/store";
import { QUERY_KEYS } from "@/lib/queryClient";

// Infos públicas do estabelecimento (GET /store/info).
// Config global que muda raramente — staleTime alto evita refetchs.
export function useStoreInfo() {
  const queryClient = useQueryClient();
  const {
    data: info,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.storeInfo,
    queryFn: getStoreInfo,
    staleTime: Infinity,
  });

  // Endereço formatado em duas linhas, no mesmo padrão usado no checkout
  const addressLines = info
    ? {
        line1: `${info.street}, ${info.number}${info.complement ? ` · ${info.complement}` : ""}`,
        line2: `${info.neighborhood} · ${info.city}`,
      }
    : null;

  // ETA de vitrine — mesma fórmula do computeEta do backend (orders.service)
  const computeEtaMinutes = (
    pizzaCount: number,
    type: "delivery" | "pickup",
  ): number | null => {
    if (!info) return null;
    const delivery = type === "delivery" ? info.deliveryMinutes : 0;
    return info.basePrepMinutes + info.perPizzaMinutes * pizzaCount + delivery;
  };

  // Consulta fresca do status (ignora o cache) — usada na finalização do pedido
  // para garantir que a loja não fechou desde que a página carregou.
  const fetchFreshStatus = async (): Promise<boolean> => {
    const fresh = await queryClient.fetchQuery({
      queryKey: QUERY_KEYS.storeInfo,
      queryFn: getStoreInfo,
      staleTime: 0,
    });
    return fresh.isOpen;
  };

  return {
    info: info ?? null,
    isLoading,
    isError,
    isOpen: info?.isOpen ?? null,
    phone: info?.phone ?? null,
    openingHours: info?.openingHours ?? null,
    deliveryFee: Number(info?.deliveryFee ?? 0),
    minOrderValue:
      info?.minOrderValue != null ? Number(info.minOrderValue) : null,
    addressLines,
    computeEtaMinutes,
    fetchFreshStatus,
  };
}

export type StoreInfoData = ReturnType<typeof useStoreInfo>;
