import { ShieldX } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";

// Shown to authenticated users without the OPERATOR role. Elevation is a
// manual step in the database, so the only way out here is switching account.
export function AccessDenied() {
  const { user } = useAuth();
  const handleLogout = useLogout();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <ShieldX className="h-12 w-12 text-error" aria-hidden />
      <h1 className="font-display text-headline-md text-on-background">
        Sem acesso
      </h1>
      <p className="max-w-md text-body-md text-on-surface-variant">
        {user
          ? `A conta ${user.email} não tem perfil de operador.`
          : "Esta conta não tem perfil de operador."}{" "}
        Fale com o administrador da pizzaria.
      </p>
      <button
        type="button"
        onClick={() => void handleLogout()}
        className="rounded-md bg-primary px-6 py-2 text-body-md font-medium text-primary-on transition-colors hover:bg-primary-tint"
      >
        Sair e trocar de conta
      </button>
    </div>
  );
}
