import { api } from './client'
import type { Ingredient } from '@/types/domain'

export const getIngredients = () =>
  api.get<Ingredient[]>('/ingredients').then((r) => r.data)
