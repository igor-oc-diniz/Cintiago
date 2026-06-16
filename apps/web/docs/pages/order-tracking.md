# Acompanhamento do pedido (`/order/:id/tracking`)

Linha do tempo do status do pedido em andamento, com polling.

[↩ Voltar ao README](../../README.md) · [Índice de páginas](./README.md)

| Item      | Valor                                           |
| --------- | ----------------------------------------------- |
| Rota      | `/order/:id/tracking` (login + perfil completo) |
| Entry     | `pages/OrderTracking/index.tsx`                 |
| Hook      | `hooks/useOrderTracking.ts`                     |
| Templates | `OrderTrackingMobile` · `OrderTrackingDesktop`  |
| Molecules | `HTimeline`, `TimelineStep`, `OrderMiniSummary` |

## Dados

- `GET /orders/my/:id` (`QUERY_KEYS.order(id)`) com
  **`refetchInterval: 30_000`** (polling).

## Regras

- **Timeline** com 5 estágios (`buildStages`): Aguardando confirmação →
  Confirmado → Em preparo → Saiu para entrega → Entregue.
- `activeIndex = progressIndex(status)` mapeia status → passo ativo.
- ETA = `order.estimatedDeliveryMinutes` (via `formatEtaMinutes`).
- `handleContact` liga para a loja (`telHref(phone)` de `useStoreInfo`).
- `handleRepeat` repete o pedido (ver [regras §10](../business-rules.md)).

## Observações

- Rótulos da timeline duplicam `ORDER_STATUS_LABEL`; `progressIndex` duplica
  `progressSegment` (useMyOrders).
- `handleRepeat` é idêntico ao de `useMyOrders`/`useOrderDetail` (triplicado).
