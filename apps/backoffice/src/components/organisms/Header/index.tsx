import { LogOut } from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import { useStoreToggle } from "@/hooks/useStoreToggle";

export function Header() {
  const { user } = useAuth();
  const handleLogout = useLogout();
  const { info, isOpen } = useStoreInfo();
  const { toggleStore, isToggling } = useStoreToggle();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-surface-lowest px-6">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-body-md font-medium text-on-surface">
          {info?.name ?? "…"}
        </span>
        <span className="text-label-sm uppercase text-on-surface-variant">
          Backoffice
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Pessimistic toggle: stays on the confirmed status while the PATCH
            runs; errors keep the status and surface a toast (useStoreToggle) */}
        <button
          type="button"
          onClick={() => toggleStore(!isOpen)}
          disabled={isToggling || isOpen === null}
          aria-pressed={isOpen === true}
          className={clsx(
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-body-md font-medium transition-colors disabled:opacity-60",
            isOpen
              ? "bg-secondary-container text-secondary-on-container hover:bg-secondary-fixed-dim"
              : "bg-error-container text-error-on-container hover:opacity-90",
          )}
        >
          <span
            className={clsx(
              "h-2.5 w-2.5 rounded-full",
              isOpen ? "bg-secondary" : "bg-error",
            )}
            aria-hidden
          />
          {isOpen === null
            ? "Carregando…"
            : isToggling
              ? "Atualizando…"
              : isOpen
                ? "Loja aberta"
                : "Loja fechada"}
        </button>

        {user && (
          <div className="flex items-center gap-2">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed text-body-md font-medium text-primary-on-fixed">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="hidden text-body-md text-on-surface md:block">
              {user.name}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => void handleLogout()}
          title="Sair"
          aria-label="Sair"
          className="rounded-md p-2 text-on-surface-variant transition-colors hover:bg-surface-high"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
