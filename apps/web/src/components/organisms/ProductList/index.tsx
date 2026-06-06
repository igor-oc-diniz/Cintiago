import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Spinner } from "@/components/atoms/Spinner";
import { ProductCard } from "@/components/molecules/ProductCard";
import { EmptyState } from "@/components/molecules/EmptyState";
import type { ProductListProps } from "./types";

const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

export function ProductList({
  products,
  isLoading,
  isError,
  onRetry,
  onAdd,
  columns = 1,
  className,
}: ProductListProps) {
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
        description="Não foi possível carregar os produtos."
        action={{ label: "Tentar novamente", onClick: onRetry }}
        className={className}
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="Sem produtos disponíveis"
        description="Nenhum produto extra disponível no momento."
        className={className}
      />
    );
  }

  return (
    <div className={cn("grid gap-3", GRID_COLS[columns], className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          imageUrl={product.imageUrl}
          price={product.price}
          onAdd={() => onAdd(product)}
        />
      ))}
    </div>
  );
}
