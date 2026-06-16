import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/useCart";
import { getPizzas } from "@/api/pizzas";
import { getProducts } from "@/api/products";
import { ROUTES } from "@/constants/routes";
import { QUERY_KEYS } from "@/lib/queryClient";
import type { ProductDTO } from "@cintiago/shared";

export type HomeTab = "pizzas" | "extras";

export function useHomeData() {
  const navigate = useNavigate();
  const { addProduct } = useCart();
  const [activeTab, setActiveTab] = useState<HomeTab>("pizzas");

  const pizzasQuery = useQuery({
    queryKey: QUERY_KEYS.pizzas,
    queryFn: getPizzas,
  });

  const productsQuery = useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: getProducts,
  });

  const handleAddProduct = (product: ProductDTO) => {
    addProduct({
      productId: product.id,
      productName: product.name,
      unitPrice: parseFloat(product.price),
    });
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  return {
    // Tab
    activeTab,
    setActiveTab,

    // Pizzas
    pizzas: pizzasQuery.data ?? [],
    pizzasLoading: pizzasQuery.isLoading,
    pizzasError: pizzasQuery.isError,
    refetchPizzas: pizzasQuery.refetch,

    // Extras
    products: productsQuery.data ?? [],
    productsLoading: productsQuery.isLoading,
    productsError: productsQuery.isError,
    refetchProducts: productsQuery.refetch,

    // Handlers
    onPizzaClick: (id: number) => navigate(ROUTES.pizza(id)),
    onAddProduct: handleAddProduct,
  };
}

export type HomePageProps = ReturnType<typeof useHomeData>;
