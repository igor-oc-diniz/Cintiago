import { Outlet } from "react-router-dom";
import { useInitAuth } from "@/hooks/useInitAuth";

export function RootLayout() {
  useInitAuth();
  return <Outlet />;
}
