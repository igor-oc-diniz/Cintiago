import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useCart } from '@/hooks/useCart'
import { getPizzas } from '@/api/pizzas'
import { getProducts } from '@/api/products'
import { QUERY_KEYS } from '@/lib/queryClient'
import type { Product } from '@/types/domain'

export type HomeTab = 'pizzas' | 'extras'

export function useHomeData() {
  const navigate          = useNavigate()
  const { addProduct }    = useCart()
  const [activeTab, setActiveTab] = useState<HomeTab>('pizzas')

  const pizzasQuery = useQuery({
    queryKey: QUERY_KEYS.pizzas,
    queryFn:  getPizzas,
  })

  const productsQuery = useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn:  getProducts,
  })

  const handleAddProduct = (product: Product) => {
    addProduct({
      productId:   product.id,
      productName: product.name,
      unitPrice:   product.price,
    })
  }

  return {
    // Tab
    activeTab,
    setActiveTab,

    // Pizzas
    pizzas:        pizzasQuery.data ?? [],
    pizzasLoading: pizzasQuery.isLoading,
    pizzasError:   pizzasQuery.isError,
    refetchPizzas: pizzasQuery.refetch,

    // Extras
    products:        productsQuery.data ?? [],
    productsLoading: productsQuery.isLoading,
    productsError:   productsQuery.isError,
    refetchProducts: productsQuery.refetch,

    // Handlers
    onPizzaClick:  (id: number) => navigate(`/pizza/${id}`),
    onAddProduct:  handleAddProduct,
  }
}

export type HomePageProps = ReturnType<typeof useHomeData>
