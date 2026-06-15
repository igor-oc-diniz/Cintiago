export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Tempo estimado em minutos → "~25 min" (vazio quando não há estimativa)
export function formatEtaMinutes(minutes: number | null): string {
  if (minutes == null) return "";
  return `~${minutes} min`;
}

// Telefone (string livre) → href "tel:" sanitizado, preservando DDI
export const telHref = (phone: string): string =>
  `tel:${phone.replace(/[^\d+]/g, "")}`;

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
  confirmed: "Confirmado",
  preparing: "Em preparo",
  delivering: "Saiu para entrega",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: "bg-[var(--gold-50)]    text-[var(--gold-900)]",
  confirmed: "bg-[var(--gold-50)]  text-[var(--gold-900)]",
  preparing: "bg-[var(--gold-50)]  text-[var(--gold-900)]",
  delivering: "bg-[var(--terracotta-50)] text-[var(--terracotta-700)]",
  delivered: "bg-[var(--basil-50)] text-[var(--basil-700)]",
  cancelled: "bg-[rgba(0,0,0,0.06)] text-[var(--fg3)]",
};

export const SIZE_LABEL: Record<string, string> = {
  small: "Pequena",
  medium: "Média",
  large: "Grande",
};
