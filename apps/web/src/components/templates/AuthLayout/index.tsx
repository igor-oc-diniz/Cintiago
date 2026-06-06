import { X } from "lucide-react";
import type { AuthLayoutProps } from "./types";

export function AuthLayout({ children, onClose }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--color-on-surface)]"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>
      )}
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="mb-8 text-center">
          <span className="font-display font-bold text-2xl text-[var(--color-primary)]">
            Cintiago
          </span>
        </div>
        <main className="w-full max-w-sm">{children}</main>
      </div>
    </div>
  );
}
