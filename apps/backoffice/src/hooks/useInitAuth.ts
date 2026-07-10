import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, setToken } from "@/store/slices/authSlice";
import { getDevToken, getMe } from "@/api/auth";
import { COOKIE_TOKEN } from "@/constants/auth";
import { useAuth } from "./useAuth";

// Phase 0: no real Google login for the backoffice yet (see global decisions
// in backoffice-guide.md). If there's no session cookie, fall back to
// GET /auth/dev-token (dev only) just to prove the app talks to the API
// authenticated as OPERATOR. Real login comes in Phase 1.
export function useInitAuth() {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAuth();
  const attempted = useRef(false);

  useEffect(() => {
    if (isLoggedIn || attempted.current) return;
    attempted.current = true;

    getMe()
      .then((user) => dispatch(setCredentials({ token: COOKIE_TOKEN, user })))
      .catch(() => bootstrapDevSession());

    function bootstrapDevSession() {
      let devToken = "";
      getDevToken()
        .then(({ token }) => {
          devToken = token;
          dispatch(setToken(token));
          return getMe();
        })
        .then((user) => dispatch(setCredentials({ token: devToken, user })))
        .catch(() => {
          // no session via cookie nor dev-token available — stays logged out
        });
    }
  }, [dispatch, isLoggedIn]);
}
