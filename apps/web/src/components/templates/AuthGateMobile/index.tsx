import { X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { GoogleMark } from "@/components/atoms/GoogleMark";
import type { AuthGateMobileProps } from "./types";

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

export function AuthGateMobile({
  isRedirecting,
  onGoogleLogin,
  onClose,
}: AuthGateMobileProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Scrim */}
      <div
        className="flex-1 bg-black/60 backdrop-blur-sm"
        role="presentation"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="w-full rounded-t-3xl bg-[var(--color-surface)] px-6 pb-10 pt-5"
        role="dialog"
        aria-modal="true"
        aria-label="Entrar na conta"
      >
        {/* Handle + close */}
        <div className="mb-6 flex items-center justify-between">
          <div className="h-1 w-10 rounded-full bg-[var(--border)] mx-auto absolute left-1/2 -translate-x-1/2" />
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-variant)] text-[var(--color-on-surface-variant)]"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
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
