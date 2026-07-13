import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

vi.mock("@/api/auth", () => ({
  getMe: () => Promise.reject(new Error("no session")),
  getDevToken: () => Promise.reject(new Error("no dev-token")),
  getGoogleAuthUrl: () => "http://localhost:3000/auth/google?from=backoffice",
  logoutApi: () => Promise.resolve(),
}));

describe("App", () => {
  it("bootstraps and lands on the login screen when there is no session", async () => {
    render(<App />);
    expect(
      await screen.findByRole("button", { name: /Entrar com Google/i }),
    ).toBeInTheDocument();
  });
});
