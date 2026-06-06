import { cn } from "@/utils/cn";
import { Button } from "@/components/atoms/Button";
import { formatPrice } from "@/utils/format";
import type { ProductCardProps } from "./types";

export function ProductCard({
  name,
  description,
  imageUrl,
  price,
  onAdd,
  className,
}: ProductCardProps) {
  return (
    <div
      className={cn(
        "flex gap-3 bg-[var(--color-surface-lowest)] rounded-lg border border-[var(--color-bamboo-accent)] p-3",
        className,
      )}
    >
      <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[var(--color-surface-high)]" />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <p className="font-body font-semibold text-[var(--color-on-surface)] leading-tight">
            {name}
          </p>
          <p className="font-body text-sm text-[var(--color-on-surface-variant)] truncate mt-0.5">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-body font-semibold text-[var(--color-primary)]">
            {formatPrice(price)}
          </span>
          <Button variant="secondary" size="sm" onClick={onAdd}>
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}
