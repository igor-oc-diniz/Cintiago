import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { StoreInfoDTO } from "@cintiago/shared";
import { QUERY_KEYS } from "@/lib/queryClient";
import { useStoreToggle } from "./useStoreToggle";
import { updateStore } from "@/api/store";
import { toast } from "sonner";

vi.mock("@/api/store", () => ({
  updateStore: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
}));

const openStore = { id: 1, name: "Cintiago", isOpen: true } as StoreInfoDTO;
const closedStore = { ...openStore, isOpen: false };

describe("useStoreToggle", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    queryClient.setQueryData(QUERY_KEYS.storeInfo, openStore);
  });

  it("updates the cached status only after the API confirms", async () => {
    vi.mocked(updateStore).mockResolvedValue(closedStore as never);
    const { result } = renderHook(() => useStoreToggle(), { wrapper });

    act(() => result.current.toggleStore(false));

    await waitFor(() =>
      expect(
        queryClient.getQueryData<StoreInfoDTO>(QUERY_KEYS.storeInfo)?.isOpen,
      ).toBe(false),
    );
    expect(updateStore).toHaveBeenCalledWith({ isOpen: false });
  });

  it("keeps the current status and shows an error toast when the API fails", async () => {
    vi.mocked(updateStore).mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useStoreToggle(), { wrapper });

    act(() => result.current.toggleStore(false));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(
      queryClient.getQueryData<StoreInfoDTO>(QUERY_KEYS.storeInfo)?.isOpen,
    ).toBe(true);
  });
});
