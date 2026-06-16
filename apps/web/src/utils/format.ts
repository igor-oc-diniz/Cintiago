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
