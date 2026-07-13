import {
  ClipboardList,
  CreditCard,
  Donut,
  Package,
  Pizza,
  Store,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Sidebar grouped by the operator's work rhythm (daily operation × catalog ×
// configuration), not by a flat entity list. In the catalog, order matters:
// Ingredients come before Pizzas because the pizza builds its base recipe
// from existing ingredients.
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Operação",
    items: [{ label: "Pedidos", to: ROUTES.orders, icon: ClipboardList }],
  },
  {
    label: "Catálogo",
    items: [
      { label: "Ingredientes", to: ROUTES.ingredients, icon: Wheat },
      { label: "Pizzas", to: ROUTES.pizzas, icon: Pizza },
      { label: "Bordas", to: ROUTES.crusts, icon: Donut },
      { label: "Produtos", to: ROUTES.products, icon: Package },
      { label: "Pagamentos", to: ROUTES.payments, icon: CreditCard },
    ],
  },
  {
    label: "Configuração",
    items: [
      { label: "Dados da pizzaria", to: ROUTES.storeSettings, icon: Store },
    ],
  },
];
