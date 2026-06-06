import { api } from './client'
import type { Pizza } from '@/types/domain'

// Shape real retornada pelo backend (pode divergir do tipo de domínio)
interface PizzaApiResponse {
  id: number
  name: string
  description: string
  imageUrl?: string | null
  priceSmall?: string | number
  priceMedium?: string | number
  priceLarge?: string | number
  prices?: { size: 'small' | 'medium' | 'large'; price: number }[]
  ingredients?: Pizza['ingredients']
  isVegetarian?: boolean
  isNew?: boolean
  active?: boolean
  createdAt?: string
}

function adaptPizza(p: PizzaApiResponse): Pizza {
  const prices = p.prices ?? [
    { size: 'small',  price: Number(p.priceSmall  ?? 0) },
    { size: 'medium', price: Number(p.priceMedium ?? 0) },
    { size: 'large',  price: Number(p.priceLarge  ?? 0) },
  ]

  return {
    id:          p.id,
    name:        p.name,
    description: p.description,
    imageUrl:    p.imageUrl ?? null,
    ingredients: p.ingredients ?? [],
    prices,
    isVegetarian: p.isVegetarian ?? false,
    isNew:        p.isNew        ?? false,
  }
}

export const getPizzas = () =>
  api.get<PizzaApiResponse[]>('/pizzas').then((r) => r.data.map(adaptPizza))

export const getPizzaById = (id: number) =>
  api.get<PizzaApiResponse>(`/pizzas/${id}`).then((r) => adaptPizza(r.data))
