import { useState } from 'react'
import { AlertCircle, Search } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Spinner } from '@/components/atoms/Spinner'
import { PizzaCard } from '@/components/molecules/PizzaCard'
import { CategoryFilter } from '@/components/molecules/CategoryFilter'
import { EmptyState } from '@/components/molecules/EmptyState'
import type { PizzaListProps } from './types'

const GRID_COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

export function PizzaList({
  pizzas,
  isLoading,
  isError,
  onRetry,
  onPizzaClick,
  columns = 2,
  className,
}: PizzaListProps) {
  const [activeCategory, setActiveCategory] = useState('Todas')

  if (isLoading) {
    return (
      <div className={cn('flex justify-center py-16', className)}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError) {
    return (
      <EmptyState
        icon={<AlertCircle size={48} />}
        title="Algo deu errado"
        description="Não foi possível carregar o cardápio."
        action={{ label: 'Tentar novamente', onClick: onRetry }}
        className={className}
      />
    )
  }

  const categories = [...new Set(pizzas.flatMap((p) =>
    p.ingredients.map((i) => (i.isVegetarian ? 'Vegetariana' : 'Tradicional')),
  ))]

  const filtered =
    activeCategory === 'Todas'
      ? pizzas
      : pizzas.filter((p) => {
          if (activeCategory === 'Vegetariana') return p.isVegetarian
          if (activeCategory === 'Tradicional') return !p.isVegetarian
          return true
        })

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={48} />}
          title="Nenhuma pizza encontrada"
          description="Tente selecionar outra categoria."
        />
      ) : (
        <div className={cn('grid gap-3', GRID_COLS[columns])}>
          {filtered.map((pizza) => {
            const startingPrice = Math.min(...pizza.prices.map((p) => p.price))
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
            )
          })}
        </div>
      )}
    </div>
  )
}
