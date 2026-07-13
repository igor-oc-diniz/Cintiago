import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FullPageSpinner } from "@/components/atoms/Spinner";
import { AccessDenied } from "@/components/templates/AccessDenied";
import { ROUTES } from "@/constants/routes";

// Being logged in is not enough for the backoffice: the session must belong
// to an OPERATOR. Four states: session still being checked → spinner; no
// session → /login; logged in without the role → "no access" screen;
// operator → renders the protected tree.
export function OperatorGuard() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  if (user.role !== "OPERATOR") {
    return <AccessDenied />;
  }

  return <Outlet />;
}
