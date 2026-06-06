import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Spinner } from "@/components/atoms/Spinner";
import { PizzaCard } from "@/components/molecules/PizzaCard";
import { EmptyState } from "@/components/molecules/EmptyState";
import type { PizzaListProps } from "./types";

const CATEGORIES = ["Todas", "Vegetariana", "Tradicional"];

const GRID_COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

export function PizzaList({
  pizzas,
  isLoading,
  isError,
  onRetry,
  onPizzaClick,
  variant = "list",
  columns = 3,
  className,
}: PizzaListProps) {
  const [activeCategory, setActiveCategory] = useState("Todas");

  if (isLoading) {
    return (
      <div className={cn("flex justify-center py-16", className)}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<AlertCircle size={48} />}
        title="Algo deu errado"
        description="Não foi possível carregar o cardápio."
        action={{ label: "Tentar novamente", onClick: onRetry }}
        className={className}
      />
    );
  }

  const filtered =
    activeCategory === "Todas"
      ? pizzas
      : activeCategory === "Vegetariana"
        ? pizzas.filter((p) => p.isVegetarian)
        : pizzas.filter((p) => !p.isVegetarian);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Filter chips */}
      <div
        className="cg-noscroll"
        style={{
          display: "flex",
          gap: variant === "grid" ? 9 : 8,
          flexWrap: variant === "grid" ? "wrap" : undefined,
          overflowX: variant === "list" ? "auto" : undefined,
          padding: "2px 0",
        }}
      >
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                height: variant === "grid" ? 38 : 36,
                padding: variant === "grid" ? "0 18px" : "0 16px",
                borderRadius: "var(--radius-full)",
                cursor: "pointer",
                border: active
                  ? "1px solid transparent"
                  : "1px solid var(--border-strong)",
                background: active ? "var(--primary)" : "var(--surface)",
                color: active ? "var(--on-primary)" : "var(--fg2)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 13.5,
                boxShadow: active ? "var(--shadow-xs)" : "none",
                transition: "all var(--dur-fast) var(--ease-soft)",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Pizza cards */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma pizza encontrada"
          description="Tente selecionar outra categoria."
        />
      ) : variant === "grid" ? (
        <div className={cn("grid gap-[22px]", GRID_COLS[columns])}>
          {filtered.map((pizza) => {
            const startingPrice = Math.min(...pizza.prices.map((p) => p.price));
            return (
              <PizzaCard
                key={pizza.id}
                id={pizza.id}
                name={pizza.name}
                description={pizza.description}
                imageUrl={pizza.imageUrl}
                startingPrice={startingPrice}
                isVegetarian={pizza.isVegetarian}
                isNew={pizza.isNew}
                variant="vertical"
                onClick={() => onPizzaClick(pizza.id)}
              />
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((pizza) => {
            const startingPrice = Math.min(...pizza.prices.map((p) => p.price));
            return (
              <PizzaCard
                key={pizza.id}
                id={pizza.id}
                name={pizza.name}
                description={pizza.description}
                imageUrl={pizza.imageUrl}
                startingPrice={startingPrice}
                isVegetarian={pizza.isVegetarian}
                isNew={pizza.isNew}
                onClick={() => onPizzaClick(pizza.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
