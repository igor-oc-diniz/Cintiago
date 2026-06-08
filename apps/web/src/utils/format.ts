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
  pending: "Aguardando",
  confirmed: "Em preparo",
  delivering: "Saiu para entrega",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: "bg-[var(--gold-50)]   text-[var(--gold-900)]",
  confirmed: "bg-[var(--gold-50)]   text-[var(--gold-900)]",
  delivering: "bg-[var(--terracotta-50)] text-[var(--terracotta-700)]",
  delivered: "bg-[var(--basil-50)]  text-[var(--basil-700)]",
  cancelled: "bg-[rgba(0,0,0,0.06)] text-[var(--fg3)]",
};

export const SIZE_LABEL: Record<string, string> = {
  small: "Pequena",
  medium: "Média",
  large: "Grande",
};
