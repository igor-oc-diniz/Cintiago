import { NavLink } from "react-router-dom";
import { clsx } from "clsx";
import { NAV_GROUPS } from "@/constants/navigation";

export function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-outline-variant bg-surface">
      <div className="flex h-16 items-center px-6">
        <span className="font-display text-xl font-bold text-primary">
          Cintiago
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-label-sm uppercase text-on-surface-variant">
              {group.label}
            </p>
            <ul className="flex flex-col gap-1">
              {group.items.map(({ label, to, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-body-md transition-colors",
                        isActive
                          ? "bg-primary-fixed font-medium text-primary-on-fixed-variant"
                          : "text-on-surface hover:bg-surface-high",
                      )
                    }
                  >
                    <Icon size={18} aria-hidden />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
