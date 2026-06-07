import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { getMe } from "@/api/auth";
import { useAuth } from "./useAuth";

export function useInitAuth() {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAuth();
  const attempted = useRef(false);

  useEffect(() => {
    if (isLoggedIn || attempted.current) return;
    attempted.current = true;

    getMe()
      .then((user) => {
        dispatch(setCredentials({ token: "cookie", user }));
      })
      .catch(() => {
        // sem sessão ativa — estado permanece vazio
      });
  }, [dispatch, isLoggedIn]);
}
