// Exemplo de hook de dados de página.
// Centraliza: queries, estado local, handlers, navegação.
// Retorna um objeto plano que pode ser desestruturado como props.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { QUERY_KEYS } from "@/lib/queryClient";

export function useExampleData() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cart = useCart();

  // Estado local da página
  const [localState, setLocalState] = useState(false);

  // Queries — dados do servidor
  const someQuery = useQuery({
    queryKey: QUERY_KEYS.pizzas,
    queryFn: () => Promise.resolve([]),
  });

  // Mutations — ações que alteram o servidor
  const someMutation = useMutation({
    mutationFn: async (payload: unknown) => payload,
    onSuccess: () => navigate("/"),
  });

  // Handlers — funções passadas como props para os layouts
  const handleSomeAction = (id: number) => {
    navigate(`/example/${id}`);
  };

  // Retorna tudo que os layouts precisam — sem JSX, sem lógica de UI
  return {
    // Estado
    localState,
    setLocalState,

    // Dados do servidor
    items: someQuery.data ?? [],
    isLoading: someQuery.isLoading,
    isError: someQuery.isError,
    refetch: someQuery.refetch,

    // Handlers
    onSomeAction: handleSomeAction,
    onSubmit: (payload: unknown) => someMutation.mutate(payload),
    isSubmitting: someMutation.isPending,
  };
}

// Tipo exportado para tipar as props dos layouts
export type ExamplePageProps = ReturnType<typeof useExampleData>;
