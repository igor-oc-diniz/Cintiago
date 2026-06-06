export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Aguardando confirmação",
  preparing: "Em preparo",
  delivering: "Saiu para entrega",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  preparing: "bg-blue-100 text-blue-800",
  delivering: "bg-purple-100 text-purple-800",
  delivered: "bg-secondary-container text-on-secondary-container",
  cancelled: "bg-error-container text-on-error-container",
};

export const SIZE_LABEL: Record<string, string> = {
  small: "Pequena",
  medium: "Média",
  large: "Grande",
};
