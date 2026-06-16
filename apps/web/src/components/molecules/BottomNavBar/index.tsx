import { useNavigate, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, ClipboardList, User } from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";

const NAV_ITEMS = [
  { label: "Home", icon: Home, path: ROUTES.home },
  { label: "Menu", icon: UtensilsCrossed, path: ROUTES.menu },
  { label: "Pedidos", icon: ClipboardList, path: ROUTES.myOrders },
  { label: "Perfil", icon: User, path: ROUTES.profile },
];

export function BottomNavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      className={cn(
        "flex items-center justify-around",
        "bg-[var(--color-surface-lowest)]/90 backdrop-blur-md",
        "border-t border-[var(--color-bamboo-accent)]",
        "pt-2 pb-safe-area-inset-bottom",
        "shadow-[0_-4px_12px_0_rgba(74,50,31,0.05)]",
      )}
    >
      {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
        const isActive = pathname === path;

        return (
          <button
            key={path}
            type="button"
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-0.5 px-4 py-1.5"
          >
            <span
              className={cn(
                "flex items-center justify-center rounded-xl px-4 py-1.5",
                isActive
                  ? "bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]"
                  : "text-[var(--color-on-surface-variant)]",
              )}
            >
              <Icon size={18} />
            </span>
            <span
              className={cn(
                "text-[10px] font-body font-semibold tracking-wide",
                isActive
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-on-surface-variant)]",
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
