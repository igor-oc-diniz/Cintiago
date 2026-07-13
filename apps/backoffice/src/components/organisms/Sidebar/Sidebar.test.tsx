import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Sidebar } from "./index";

function renderSidebar(initialPath = "/pedidos") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Sidebar />
    </MemoryRouter>,
  );
}

describe("Sidebar", () => {
  it("renders the three navigation groups", () => {
    renderSidebar();
    expect(screen.getByText("Operação")).toBeInTheDocument();
    expect(screen.getByText("Catálogo")).toBeInTheDocument();
    expect(screen.getByText("Configuração")).toBeInTheDocument();
  });

  it("renders the catalog with Ingredientes before Pizzas", () => {
    renderSidebar();
    const labels = screen
      .getAllByRole("link")
      .map((link) => link.textContent?.trim());
    expect(labels.indexOf("Ingredientes")).toBeLessThan(
      labels.indexOf("Pizzas"),
    );
  });

  it("marks the current screen's link as active", () => {
    renderSidebar("/catalogo/pizzas");
    expect(screen.getByRole("link", { name: "Pizzas" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Pedidos" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
