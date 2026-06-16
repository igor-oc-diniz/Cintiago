// Rotas centralizadas — evita magic strings em navigate(...) espalhadas pelo
// código. Rotas com parâmetro são helpers. Os padrões declarativos (com :id)
// continuam em src/router/index.tsx.
export const ROUTES = {
  home: "/",
  menu: "/menu",
  pizza: (id: number | string) => `/pizza/${id}`,
  cart: "/cart",
  delivery: "/cart/delivery",
  payment: "/cart/payment",
  login: "/login",
  onboarding: "/onboarding",
  orderConfirm: "/order/confirm",
  orderTracking: (id: number | string) => `/order/${id}/tracking`,
  myOrders: "/orders",
  orderDetail: (id: number | string) => `/orders/${id}`,
  profile: "/profile",
} as const;
