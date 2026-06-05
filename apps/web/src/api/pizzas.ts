import { api } from './client'
import type { Pizza } from '@/types/domain'

export const getPizzas = () =>
  api.get<Pizza[]>('/pizzas').then((r) => r.data)

export const getPizzaById = (id: number) =>
  api.get<Pizza>(`/pizzas/${id}`).then((r) => r.data)
