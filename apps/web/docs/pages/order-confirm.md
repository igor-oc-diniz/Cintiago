# Confirmação do pedido (`/order/confirm`)

Cria o pedido no backend e mostra o resumo de sucesso com ETA.

[↩ Voltar ao README](../../README.md) · [Índice de páginas](./README.md)

| Item     | Valor                                      |
| -------- | ------------------------------------------ |
| Rota     | `/order/confirm` (login + perfil completo) |
| Entry    | `pages/OrderConfirm/index.tsx`             |
| Hook     | `hooks/useOrderConfirm.ts`                 |
| Template | `OrderConfirmMobile`                       |
| Atoms    | `CheckAnimation`, `OrderSeal`              |

## Fluxo

1. Ao montar (uma única vez), se ainda não há `activeOrder`, dispara
   `POST /orders` com `serializeCartToOrderPayload(...)` + `deliveryType`.
2. Em sucesso: `setActiveOrder(order)` + `clearCart()`.
3. Exibe resumo (itens, entrega, pagamento, total, ETA) e ações
   "Acompanhar" (`/order/:id/tracking`) e "Início".

## Regras

- **Snapshot do carrinho** capturado antes do `clearCart()` (deliveryType e
  subtotal) para exibição durante/depois da limpeza do Redux.
- `total` exibido = `order.total` (já inclui entrega, calculado no backend);
  fallback pré-resposta = `subtotal + effectiveFee`.
- ETA = `formatEtaMinutes(order.estimatedDeliveryMinutes)`.

## Observações

- `clientId` resolvido pelo backend via JWT.
- `deliveryType` é anexado ao payload aqui, mas **não** consta em
  `CreateOrderPayloadDTO` (`@cintiago/shared`) — mismatch de tipo.
- `DELIVERY_LABELS` local divergente do carrinho.
