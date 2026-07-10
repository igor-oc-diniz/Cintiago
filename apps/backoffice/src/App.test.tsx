import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

vi.mock("@/api/auth", () => ({
  getMe: () => Promise.reject(new Error("no session")),
  getDevToken: () => Promise.reject(new Error("no dev-token")),
}));

describe("App", () => {
  it("renders without crashing and shows the Home page", async () => {
    render(<App />);
    expect(
      await screen.findByText(/Pedidos \(em construção\)/i),
    ).toBeInTheDocument();
  });
});
