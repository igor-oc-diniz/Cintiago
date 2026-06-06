import type { Pizza } from '@/types/domain'

export interface PizzaListProps {
  pizzas: Pizza[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onPizzaClick: (id: number) => void
  variant?: 'list' | 'grid'
  columns?: 2 | 3 | 4
  className?: string
}
