import { Button } from "@/components/atoms/Button";
import { GoogleMark } from "@/components/atoms/GoogleMark";
import type { AuthGateDesktopProps } from "./types";

function Logo() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{
          width: 56,
          height: 56,
          background: "var(--color-primary)",
        }}
      >
        <span
          className="font-display font-bold text-white"
          style={{ fontSize: 22, letterSpacing: -0.5 }}
        >
          C
        </span>
      </div>
      <span
        className="font-display font-bold text-[var(--color-on-surface)]"
        style={{ fontSize: 20, letterSpacing: -0.5 }}
      >
        Cintiago
      </span>
    </div>
  );
}

export function AuthGateDesktop({
  isRedirecting,
  onGoogleLogin,
}: AuthGateDesktopProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
      <div
        className="w-full max-w-sm rounded-3xl bg-[var(--color-surface)] px-8 py-10 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-label="Entrar na conta"
      >
        <div className="flex flex-col items-center gap-8">
          <Logo />

          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-display font-semibold text-xl text-[var(--color-on-surface)]">
              Entre na sua conta
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              Faça login para finalizar seu pedido e acompanhar suas entregas.
            </p>
          </div>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            loading={isRedirecting}
            onClick={onGoogleLogin}
            className="gap-3 border-[var(--border)] !rounded-2xl"
          >
            <GoogleMark />
            <span>Entrar com Google</span>
          </Button>

          <p className="text-xs text-[var(--color-on-surface-variant)] text-center leading-relaxed max-w-xs">
            Ao continuar, você concorda com nossos{" "}
            <span className="text-[var(--color-primary)]">Termos de Uso</span> e{" "}
            <span className="text-[var(--color-primary)]">
              Política de Privacidade
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
