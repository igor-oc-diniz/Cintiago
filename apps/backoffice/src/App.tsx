import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { store } from "@/store/store";
import { queryClient } from "@/lib/queryClient";
import { router } from "@/router";

export function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="bottom-center" richColors />
      </QueryClientProvider>
    </Provider>
  );
}
