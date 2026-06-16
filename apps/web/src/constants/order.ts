import type { OrderStatus } from "@cintiago/shared";

interface OrderStatusMeta {
  // Rótulo curto (badge, resumos)
  label: string;
  // Rótulo da timeline de acompanhamento
  trackingLabel: string;
  // Classes de cor do badge (tokens de design)
  color: string;
  // Índice 0-based na timeline; null = fora do fluxo (cancelado)
  step: number | null;
}

// Fonte única da verdade para status de pedido: rótulos, cor e posição na
// timeline. Deriva ORDER_STATUS_LABEL/COLOR e os índices de progresso.
export const ORDER_STATUS: Record<OrderStatus, OrderStatusMeta> = {
  pending: {
    label: "Aguardando",
    trackingLabel: "Aguardando confirmação",
    color: "bg-[var(--gold-50)]    text-[var(--gold-900)]",
    step: 0,
  },
  confirmed: {
    label: "Confirmado",
    trackingLabel: "Confirmado",
    color: "bg-[var(--gold-50)]  text-[var(--gold-900)]",
    step: 1,
  },
  preparing: {
    label: "Em preparo",
    trackingLabel: "Em preparo",
    color: "bg-[var(--gold-50)]  text-[var(--gold-900)]",
    step: 2,
  },
  delivering: {
    label: "Saiu para entrega",
    trackingLabel: "Saiu para entrega",
    color: "bg-[var(--terracotta-50)] text-[var(--terracotta-700)]",
    step: 3,
  },
  delivered: {
    label: "Entregue",
    trackingLabel: "Entregue",
    color: "bg-[var(--basil-50)] text-[var(--basil-700)]",
    step: 4,
  },
  cancelled: {
    label: "Cancelado",
    trackingLabel: "Cancelado",
    color: "bg-[rgba(0,0,0,0.06)] text-[var(--fg3)]",
    step: null,
  },
};

// Record<string, string> para indexação segura com variantes arbitrárias (Badge).
export const ORDER_STATUS_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(ORDER_STATUS).map(([k, v]) => [k, v.label]),
);

export const ORDER_STATUS_COLOR: Record<string, string> = Object.fromEntries(
  Object.entries(ORDER_STATUS).map(([k, v]) => [k, v.color]),
);

export function orderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS[status]?.label ?? status;
}

// Índice ativo da timeline (0-based); cancelado cai no início.
export function progressIndex(status: OrderStatus): number {
  return ORDER_STATUS[status]?.step ?? 0;
}

// Segmentos preenchidos (1-based); cancelado não preenche nenhum.
export function progressSegment(status: OrderStatus): number {
  const step = ORDER_STATUS[status]?.step;
  return step == null ? 0 : step + 1;
}
