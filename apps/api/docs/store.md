# Estabelecimento (`Store`)

Configuração global da pizzaria, tratada como **singleton**: existe (ou deveria
existir) **um único registro**. Guarda os dados de vitrine (nome, contato,
endereço, horários), a **taxa de entrega** e os **tempos** usados para estimar o
ETA dos pedidos.

[↩ Voltar ao README](../README.md)

---

## Modelo `Store`

| Campo             | Tipo     | Default | Uso                                                 |
| ----------------- | -------- | ------- | --------------------------------------------------- |
| `id`              | Int      | —       | PK                                                  |
| `name`            | String   | `""`    | Nome da loja                                        |
| `description`     | String?  | —       | Descrição                                           |
| `phone`           | String   | `""`    | Telefone                                            |
| `email`           | String?  | —       | E-mail                                              |
| `isOpen`          | Boolean  | `true`  | Loja aberta/fechada                                 |
| `deliveryFee`     | Decimal  | `0`     | **Taxa de entrega** aplicada aos pedidos `delivery` |
| `minOrderValue`   | Decimal? | —       | Pedido mínimo                                       |
| `openingHours`    | String?  | —       | Horário de funcionamento (texto)                    |
| **Localização**   |          |         |                                                     |
| `street`          | String   | `""`    | Rua                                                 |
| `number`          | String   | `""`    | Número                                              |
| `complement`      | String?  | —       | Complemento                                         |
| `neighborhood`    | String   | `""`    | Bairro                                              |
| `city`            | String   | `""`    | Cidade                                              |
| `zipCode`         | String   | `""`    | CEP                                                 |
| **Tempos (ETA)**  |          |         |                                                     |
| `basePrepMinutes` | Int      | `10`    | Tempo base de preparo                               |
| `perPizzaMinutes` | Int      | `8`     | Minutos por pizza                                   |
| `deliveryMinutes` | Int      | `20`    | Tempo de deslocamento (só em `delivery`)            |
| `createdAt`       | DateTime | `now()` | —                                                   |
| `updatedAt`       | DateTime | `now()` | `@updatedAt`                                        |

---

## Regras de negócio

- **Singleton.** O service sempre opera no **primeiro** registro
  (`findFirst`). O `PATCH /store` faz "upsert manual": se ainda não existe
  nenhum `Store`, **cria**; caso contrário, **atualiza** aquele registro.
- **Fonte da taxa de entrega.** O `createOrder` lê `Store.deliveryFee` para
  compor o `deliveryFee`/`total` do pedido (ver [orders.md](./orders.md)).
- **Fonte dos tempos de ETA.** `basePrepMinutes`, `perPizzaMinutes` e
  `deliveryMinutes` alimentam o `computeEta`. Sem `Store`, o ETA dos pedidos vem
  `null`.
- **`isOpen` e `minOrderValue` ainda não são impostos no `createOrder`** — hoje
  servem como informação de vitrine; a validação no fechamento do pedido está
  anotada no `TODO.md`.

---

## Endpoints

| Método  | Rota          | Papel      | Descrição                                                   |
| ------- | ------------- | ---------- | ----------------------------------------------------------- |
| `GET`   | `/store/info` | público    | Dados de vitrine (campos selecionados; usado pelo frontend) |
| `GET`   | `/store`      | `OPERATOR` | Registro completo                                           |
| `PATCH` | `/store`      | `OPERATOR` | Atualiza o singleton (cria se não existir)                  |

### `GET /store/info` (público)

Retorna um subconjunto via `select`: identificação, contato, endereço,
`deliveryFee`, `minOrderValue`, `openingHours`, `isOpen` **e** os tempos
(`basePrepMinutes`/`perPizzaMinutes`/`deliveryMinutes`) — estes últimos para o
frontend derivar um ETA de vitrine. Retorna `404` se o `Store` nunca foi
configurado.
