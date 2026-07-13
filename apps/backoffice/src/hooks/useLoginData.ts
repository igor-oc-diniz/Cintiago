import { useState } from "react";
import { useAuth } from "./useAuth";
import { getGoogleAuthUrl } from "@/api/auth";

export function useLoginData() {
  const { user, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoogleLogin = () => {
    setIsRedirecting(true);
    window.location.assign(getGoogleAuthUrl());
  };

  return {
    isCheckingSession: isLoading,
    isOperator: user?.role === "OPERATOR",
    isLoggedInWithoutAccess: !!user && user.role !== "OPERATOR",
    isRedirecting,
    handleGoogleLogin,
  };
}
