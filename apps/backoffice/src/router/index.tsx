import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/templates/RootLayout";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("@/pages/Home"));

const Fallback = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Fallback />}>
            <Home />
          </Suspense>
        ),
      },
    ],
  },
]);
