import { Navigate } from "react-router-dom";
import { useLoginData } from "@/hooks/useLoginData";
import { FullPageSpinner } from "@/components/atoms/Spinner";
import { AccessDenied } from "@/components/templates/AccessDenied";
import { ROUTES } from "@/constants/routes";

export default function Login() {
  const {
    isCheckingSession,
    isOperator,
    isLoggedInWithoutAccess,
    isRedirecting,
    handleGoogleLogin,
  } = useLoginData();

  if (isCheckingSession) {
    return <FullPageSpinner />;
  }

  if (isOperator) {
    return <Navigate to={ROUTES.orders} replace />;
  }

  if (isLoggedInWithoutAccess) {
    return <AccessDenied />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-lg bg-surface-lowest p-8 text-center shadow-artisan">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-headline-md text-on-background">
            Cintiago
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Backoffice do operador
          </p>
        </div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isRedirecting}
          className="rounded-md bg-primary px-6 py-3 text-body-md font-medium text-primary-on transition-colors hover:bg-primary-tint disabled:opacity-60"
        >
          {isRedirecting ? "Redirecionando…" : "Entrar com Google"}
        </button>
      </div>
    </div>
  );
}
