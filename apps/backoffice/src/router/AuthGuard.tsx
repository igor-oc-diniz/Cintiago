import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Phase 0 stub: only checks the session. The role === OPERATOR gate (with an
// "access denied" screen for non-operators) is Phase 1 — this component isn't
// wired into the router until then.
export function AuthGuard() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
