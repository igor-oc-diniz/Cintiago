import { api } from './client'
import type { Product } from '@/types/domain'

export const getProducts = () =>
  api.get<Product[]>('/products').then((r) => r.data)
