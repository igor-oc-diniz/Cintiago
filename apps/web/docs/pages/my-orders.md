# Meus pedidos (`/orders`)

Lista de pedidos do cliente, separados em **ativos** e **passados**.

[↩ Voltar ao README](../../README.md) · [Índice de páginas](./README.md)

| Item      | Valor                                                     |
| --------- | --------------------------------------------------------- |
| Rota      | `/orders` (login + perfil completo)                       |
| Entry     | `pages/MyOrders/index.tsx`                                |
| Hook      | `hooks/useMyOrders.ts`                                    |
| Templates | `MyOrdersMobile` · `MyOrdersDesktop`                      |
| Molecules | `ActiveOrderCard(Desktop)`, `PastOrderCard`, `EmptyState` |

## Dados

- `GET /orders/my` (`QUERY_KEYS.myOrders`).

## Regras

- **Ativos:** `pending`, `confirmed`, `preparing`, `delivering`, `delivered`.
  **Passados:** `cancelled` (demais).
- `progressSegment(status)` → segmento da barra de progresso (1–5).
- **Navegação contextual** (`handleOpenOrder`): `delivered` → `/orders/:id`;
  demais → `/order/:id/tracking`.
- `getItemHeadlines` monta linhas "Nº× Nome · Tamanho" (meia-a-meia junta os dois nomes).
- `handleRepeat` repete o pedido.

## Observações

- Cards de status: borda verde para `delivered`, padrão para `cancelled`;
  botão "Acompanhar" oculto nesses dois estados.
- `handleRepeat` e o fallback `"Pizza"` duplicados em outros hooks.
