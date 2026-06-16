# Pagamentos (`Payment`)

Métodos de pagamento aceitos pela pizzaria. Cada pedido referencia **um**
`Payment`. O campo `type` (enum `PaymentType`) é o que o sistema usa para tomar
decisões — por exemplo, exibir o campo de troco quando o pagamento é em dinheiro.

[↩ Voltar ao README](../README.md)

---

## Modelo `Payment`

| Campo    | Tipo          | Regra                                    |
| -------- | ------------- | ---------------------------------------- |
| `id`     | Int           | PK                                       |
| `name`   | String        | Rótulo exibido (ex: "Cartão de crédito") |
| `type`   | `PaymentType` | **Obrigatório** — categoria do método    |
| `active` | Boolean       | default `true` — controla a vitrine      |
| `orders` | `Order[]`     | Pedidos que usaram este método           |

### Enum `PaymentType`

```
enum PaymentType { CASH | CREDIT | DEBIT | PIX }
```

> `name` é o texto livre exibido; `type` é a **categoria estável**. A lógica de
> negócio (front e back) decide pelo `type`, nunca pelo `name`. Ex: o frontend
> mostra o campo de troco quando `payment.type === "CASH"`.

---

## Regras de negócio

- **`type` é obrigatório.** `CreatePaymentDto` exige `type`; `UpdatePaymentDto`
  aceita opcional. É o `type` que diferencia "dinheiro" de "cartão" para o resto
  do sistema.
- **Troco só faz sentido em `CASH`.** O `Order.changeFor` é preenchido apenas
  quando o pagamento é em dinheiro — ver [orders.md](./orders.md).
- **`active` controla a vitrine.** `GET /payments` retorna apenas métodos ativos.
  - ⚠️ Hoje o `createOrder` **não** revalida se o `paymentId` recebido está ativo
    (confia na FK). Melhoria anotada no `TODO.md`.

---

## Endpoints

| Método   | Rota            | Papel      | Descrição                       |
| -------- | --------------- | ---------- | ------------------------------- |
| `GET`    | `/payments`     | público    | Lista métodos **ativos**        |
| `GET`    | `/payments/:id` | público    | Busca por id                    |
| `POST`   | `/payments`     | `OPERATOR` | Cria um método                  |
| `PATCH`  | `/payments/:id` | `OPERATOR` | Atualiza `name`/`type`/`active` |
| `DELETE` | `/payments/:id` | `OPERATOR` | Remove definitivamente          |
