import type { Product } from '@/types/domain'

export interface ProductListProps {
  products: Product[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onAdd: (product: Product) => void
  columns?: 1 | 2 | 3 | 4
  className?: string
}
