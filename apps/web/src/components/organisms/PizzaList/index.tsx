import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Spinner } from "@/components/atoms/Spinner";
import { PizzaCard } from "@/components/molecules/PizzaCard";
import { EmptyState } from "@/components/molecules/EmptyState";
import type { PizzaListProps } from "./types";

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

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Pizza cards */}
      {pizzas.length === 0 ? (
        <EmptyState
          title="Nenhuma pizza encontrada"
          description="O cardápio está indisponível no momento."
        />
      ) : variant === "grid" ? (
        <div className={cn("grid gap-[22px]", GRID_COLS[columns])}>
          {pizzas.map((pizza) => {
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
          {pizzas.map((pizza) => {
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
