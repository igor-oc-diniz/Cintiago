# Detalhe do pedido (`/orders/:id`)

Recibo completo de um pedido concluído, com itens, valores e avaliação.

[↩ Voltar ao README](../../README.md) · [Índice de páginas](./README.md)

| Item      | Valor                                              |
| --------- | -------------------------------------------------- |
| Rota      | `/orders/:id` (login + perfil completo)            |
| Entry     | `pages/OrderDetail/index.tsx`                      |
| Hook      | `hooks/useOrderDetail.ts`                          |
| Templates | `OrderDetailMobile` · `OrderDetailDesktop`         |
| Molecules | `RatingCard`, `StarRating`, `InfoBlock`, `MetaRow` |

## Dados

- `GET /orders/my/:id` (`QUERY_KEYS.order(id)`).

## Regras

- **Valores:** `subtotal`/`deliveryFee` vêm do backend; quando ausentes
  (pedidos antigos), derivados de `computeOrderItemCurrentPrice` e do `total`.
- **Endereço/entrega:** `isDelivery = deliveryType === "delivery"` controla
  labels e o sub do `InfoBlock`.
- **Avaliação:** `POST /orders/:id/rating { stars, comment? }` para pedidos
  `delivered`; invalida `QUERY_KEYS.order(id)`. Avaliação existente em
  `order.rating`.
- `handleContact` (telefone da loja) e `handleRepeat` (repetir pedido).

## Observações

- `handleRepeat` triplicado; fallback `"Pizza"` repetido.
