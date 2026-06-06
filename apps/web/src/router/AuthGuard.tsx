import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  requireProfile?: boolean;
}

export function AuthGuard({ requireProfile = true }: AuthGuardProps) {
  const { isLoggedIn, hasCompletedProfile } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireProfile && !hasCompletedProfile) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
