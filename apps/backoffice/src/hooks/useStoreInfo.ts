import { useQuery } from "@tanstack/react-query";
import { getStoreInfo } from "@/api/store";
import { QUERY_KEYS } from "@/lib/queryClient";

// Store identity + open/closed status for the header (GET /store/info).
export function useStoreInfo() {
  const {
    data: info,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.storeInfo,
    queryFn: getStoreInfo,
  });

  return {
    info: info ?? null,
    isLoading,
    isError,
    isOpen: info?.isOpen ?? null,
  };
}
