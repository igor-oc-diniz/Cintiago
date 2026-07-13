import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";
import { RootLayout } from "@/components/templates/RootLayout";
import { AppShell } from "@/components/templates/AppShell";
import { OperatorGuard } from "@/router/OperatorGuard";
import { FullPageSpinner } from "@/components/atoms/Spinner";
import { ROUTES } from "@/constants/routes";

const Login = lazy(() => import("@/pages/Login"));
const Orders = lazy(() => import("@/pages/Orders"));
const Ingredients = lazy(() => import("@/pages/Ingredients"));
const Pizzas = lazy(() => import("@/pages/Pizzas"));
const Crusts = lazy(() => import("@/pages/Crusts"));
const Products = lazy(() => import("@/pages/Products"));
const Payments = lazy(() => import("@/pages/Payments"));
const StoreSettings = lazy(() => import("@/pages/StoreSettings"));

const page = (element: ReactNode) => (
  <Suspense fallback={<FullPageSpinner />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.login, element: page(<Login />) },
      {
        element: <OperatorGuard />,
        children: [
          {
            element: <AppShell />,
            children: [
              // Orders is the backoffice's initial screen
              {
                path: "/",
                element: <Navigate to={ROUTES.orders} replace />,
              },
              { path: ROUTES.orders, element: page(<Orders />) },
              { path: ROUTES.ingredients, element: page(<Ingredients />) },
              { path: ROUTES.pizzas, element: page(<Pizzas />) },
              { path: ROUTES.crusts, element: page(<Crusts />) },
              { path: ROUTES.products, element: page(<Products />) },
              { path: ROUTES.payments, element: page(<Payments />) },
              { path: ROUTES.storeSettings, element: page(<StoreSettings />) },
              {
                path: "*",
                element: <Navigate to={ROUTES.orders} replace />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
