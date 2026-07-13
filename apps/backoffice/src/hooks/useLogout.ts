import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { logoutApi } from "@/api/auth";
import { ROUTES } from "@/constants/routes";

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Best effort: even if the API call fails, drop the local session.
    }
    queryClient.clear();
    dispatch(logout());
    navigate(ROUTES.login, { replace: true });
  }, [dispatch, navigate, queryClient]);
}
