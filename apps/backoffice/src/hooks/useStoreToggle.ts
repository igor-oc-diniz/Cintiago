import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { StoreInfoDTO } from "@cintiago/shared";
import { updateStore } from "@/api/store";
import { QUERY_KEYS } from "@/lib/queryClient";

// Open/closed toggle (PATCH /store { isOpen }), pessimistic by decision:
// the displayed status only changes after the API confirms; on error it
// stays as-is and the operator gets a toast.
export function useStoreToggle() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (isOpen: boolean) => updateStore({ isOpen }),
    onSuccess: (updated) => {
      // StoreDTO extends StoreInfoDTO, so the PATCH response can seed the
      // header query directly — no flicker while waiting for a refetch.
      queryClient.setQueryData<StoreInfoDTO>(QUERY_KEYS.storeInfo, updated);
    },
    onError: () => {
      toast.error("Não foi possível atualizar o status da loja");
    },
  });

  return {
    toggleStore: mutation.mutate,
    isToggling: mutation.isPending,
  };
}
