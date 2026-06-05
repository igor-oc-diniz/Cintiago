import { cn } from '@/utils/cn'
import { Badge } from '@/components/atoms/Badge'
import { formatPrice } from '@/utils/format'
import type { PizzaCardProps } from './types'

export function PizzaCard({
  name,
  description,
  imageUrl,
  startingPrice,
  isVegetarian,
  isNew,
  onClick,
  className,
}: PizzaCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={cn(
        'rounded-xl border border-[var(--color-bamboo-accent)] shadow-[var(--shadow)] overflow-hidden cursor-pointer',
        'transition-transform hover:scale-[1.01] active:scale-[0.99]',
        className,
      )}
    >
      <div className="relative aspect-[4/3]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-surface-high)]" />
        )}
        {(isVegetarian || isNew) && (
          <div className="absolute top-3 left-3 flex gap-1">
            {isVegetarian && <Badge variant="vegetarian" />}
            {isNew && <Badge variant="new" />}
          </div>
        )}
      </div>
      <div className="bg-[var(--color-surface-low)] px-4 py-3">
        <p className="font-display font-semibold text-lg text-[var(--color-on-surface)] leading-tight">
          {name}
        </p>
        <p className="font-body text-sm text-[var(--color-on-surface-variant)] line-clamp-2 mt-0.5">
          {description}
        </p>
        <p className="font-body font-semibold text-[var(--color-primary)] mt-2">
          a partir de {formatPrice(startingPrice)}
        </p>
      </div>
    </div>
  )
}
