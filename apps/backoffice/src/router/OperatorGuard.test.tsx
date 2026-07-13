import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { MeDTO } from "@cintiago/shared";
import authReducer from "@/store/slices/authSlice";
import { OperatorGuard } from "./OperatorGuard";

const buildUser = (role: MeDTO["role"]): MeDTO => ({
  id: 1,
  name: "Maria",
  email: "maria@example.com",
  avatar: null,
  role,
  clientId: null,
});

interface AuthPreload {
  user: MeDTO | null;
  isLoading: boolean;
}

function renderGuard({ user, isLoading }: AuthPreload) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: { token: user ? "cookie" : null, user, isLoading },
    },
  });

  return render(
    <Provider store={store}>
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route element={<OperatorGuard />}>
              <Route path="/" element={<p>conteúdo protegido</p>} />
            </Route>
            <Route path="/login" element={<p>página de login</p>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>,
  );
}

describe("OperatorGuard", () => {
  it("shows a spinner while the session is being checked", () => {
    renderGuard({ user: null, isLoading: true });
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("conteúdo protegido")).not.toBeInTheDocument();
  });

  it("redirects to /login when there is no session", () => {
    renderGuard({ user: null, isLoading: false });
    expect(screen.getByText("página de login")).toBeInTheDocument();
  });

  it("shows the access-denied screen for a logged-in non-operator", () => {
    renderGuard({ user: buildUser("CLIENT"), isLoading: false });
    expect(screen.getByText("Sem acesso")).toBeInTheDocument();
    expect(screen.queryByText("conteúdo protegido")).not.toBeInTheDocument();
  });

  it("renders the protected content for an operator", () => {
    renderGuard({ user: buildUser("OPERATOR"), isLoading: false });
    expect(screen.getByText("conteúdo protegido")).toBeInTheDocument();
  });
});
