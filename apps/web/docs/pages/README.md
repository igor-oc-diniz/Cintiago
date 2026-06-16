# Páginas — Cintiago Web

Uma página por rota. Cada doc descreve rota, hook de dados, layouts/templates,
regras e observações. Estrutura de página em
[arquitetura](../architecture.md#anatomia-de-uma-página).

[↩ Voltar ao README principal](../../README.md)

## Fluxo público (cardápio → carrinho)

| Página                                      | Rota             | Proteção |
| ------------------------------------------- | ---------------- | -------- |
| [Home (Cardápio)](./home.md)                | `/`              | pública  |
| [Detalhe / Montagem](./pizza-detail.md)     | `/pizza/:id`     | pública  |
| [Carrinho](./cart.md)                       | `/cart`          | pública  |
| [Seleção de entrega](./select-delivery.md)  | `/cart/delivery` | pública  |
| [Seleção de pagamento](./select-payment.md) | `/cart/payment`  | pública  |

## Autenticação

| Página                        | Rota          | Proteção                   |
| ----------------------------- | ------------- | -------------------------- |
| [Login](./login.md)           | `/login`      | pública                    |
| [Onboarding](./onboarding.md) | `/onboarding` | login (perfil não exigido) |

## Pós-pedido (requer login + perfil completo)

| Página                                 | Rota                  |
| -------------------------------------- | --------------------- |
| [Confirmação](./order-confirm.md)      | `/order/confirm`      |
| [Acompanhamento](./order-tracking.md)  | `/order/:id/tracking` |
| [Meus pedidos](./my-orders.md)         | `/orders`             |
| [Detalhe do pedido](./order-detail.md) | `/orders/:id`         |
| [Perfil](./profile.md)                 | `/profile`            |
