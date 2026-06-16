# Carrinho (`/cart`)

Revisão dos itens, escolha de entrega/pagamento e finalização do pedido.

[↩ Voltar ao README](../../README.md) · [Índice de páginas](./README.md)

| Item      | Valor                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------- |
| Rota      | `/cart` (pública)                                                                              |
| Entry     | `pages/Cart/index.tsx`                                                                         |
| Hook      | `pages/Cart/useCartData.ts`                                                                    |
| Layouts   | `Cart.mobile.tsx` · `Cart.desktop.tsx`                                                         |
| Molecules | `PizzaCartCard`, `ProductCartCard`, `SumLine`, `EmptyState`, `StoreClosedModal`, `SelectorRow` |

## Dados / estado

- Itens, subtotal, entrega, pagamento e troco vêm do `cartSlice` (`useCart`).
- `deliveryFee`, `minOrderValue`, `openingHours`, `fetchFreshStatus` de
  `useStoreInfo`.

## Regras

- `fee = deliveryType === "delivery" ? deliveryFee : 0`; `total = subtotal + fee`.
- **Pedido mínimo** sobre o subtotal: `meetsMinimum`.
- Botão de finalizar só habilita com `ready = !isEmpty && deliveryType &&
paymentName && meetsMinimum`.
- `checkoutHint` indica o que falta (prioridade: mínimo → entrega → pagamento).
- Itens (pizza e produto) podem ter quantidade alterada e ser removidos.
- Pizza editável → navega para `/pizza/:id` com `state.item`.
- **Checkout:** `handleCheckout` consulta status **fresco** da loja
  (`fetchFreshStatus`): aberta → `/order/confirm`; fechada → `StoreClosedModal`;
  erro → segue mesmo assim.

## Observações

- `DELIVERY_LABELS` definido localmente, divergente de `useOrderConfirm`.
- Login **não** é exigido aqui — só na confirmação.
