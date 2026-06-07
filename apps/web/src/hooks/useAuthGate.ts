import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, setLoading } from "@/store/slices/authSlice";
import { getGoogleAuthUrl, getMe } from "@/api/auth";
import { useAuth } from "./useAuth";

export interface UseAuthGateReturn {
  isCheckingSession: boolean;
  isRedirecting: boolean;
  handleGoogleLogin: () => void;
  handleClose: () => void;
}

export function useAuthGate(): UseAuthGateReturn {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, hasCompletedProfile } = useAuth();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const from = (location.state as { from?: { pathname: string } } | null)?.from
    ?.pathname;

  useEffect(() => {
    if (isLoggedIn) {
      redirectAfterLogin(hasCompletedProfile);
      return;
    }

    getMe()
      .then((user) => {
        dispatch(setCredentials({ token: "cookie", user }));
        redirectAfterLogin(!!user.clientId);
      })
      .catch(() => {
        setIsCheckingSession(false);
      });
  }, []);

  function redirectAfterLogin(hasProfile: boolean) {
    if (!hasProfile) {
      navigate("/onboarding", { replace: true });
    } else {
      navigate(from ?? "/", { replace: true });
    }
  }

  function handleGoogleLogin() {
    setIsRedirecting(true);
    dispatch(setLoading(true));
    window.location.href = getGoogleAuthUrl();
  }

  function handleClose() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  }

  return {
    isCheckingSession,
    isRedirecting,
    handleGoogleLogin,
    handleClose,
  };
}
