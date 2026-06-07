import { useAuthGate } from "@/hooks/useAuthGate";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { AuthGateMobile } from "@/components/templates/AuthGateMobile";
import { AuthGateDesktop } from "@/components/templates/AuthGateDesktop";
import { Spinner } from "@/components/atoms/Spinner";

export default function Login() {
  const { isCheckingSession, isRedirecting, handleGoogleLogin, handleClose } =
    useAuthGate();
  const { isMobile } = useBreakpoint();

  if (isCheckingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-background)]">
        <Spinner size="md" />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <AuthGateMobile
          isRedirecting={isRedirecting}
          onGoogleLogin={handleGoogleLogin}
          onClose={handleClose}
        />
      </div>
    );
  }

  return (
    <AuthGateDesktop
      isRedirecting={isRedirecting}
      onGoogleLogin={handleGoogleLogin}
    />
  );
}
