// Centralized routes — avoids magic strings scattered across navigate(...)
// calls. Declarative patterns (with :id) stay in src/router/index.tsx.
export const ROUTES = {
  login: "/login",
  orders: "/pedidos",
  ingredients: "/catalogo/ingredientes",
  pizzas: "/catalogo/pizzas",
  crusts: "/catalogo/bordas",
  products: "/catalogo/produtos",
  payments: "/catalogo/pagamentos",
  storeSettings: "/configuracao/loja",
} as const;
