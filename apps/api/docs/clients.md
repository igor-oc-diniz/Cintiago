# Clientes (`Client`)

Representa o **cadastro de entrega** de um usuário: telefone e endereço. Um
`Client` está sempre vinculado 1:1 a um `User` (login Google). Sem `Client`, o
usuário consegue logar mas não consegue finalizar um pedido (não há para onde
entregar).

[↩ Voltar ao README](../README.md)

---

## Modelo `Client`

| Campo          | Tipo      | Regra                                          |
| -------------- | --------- | ---------------------------------------------- |
| `id`           | Int       | PK                                             |
| `userId`       | Int       | Único — FK para `User` (relação 1:1)           |
| `phone`        | String    | Obrigatório                                    |
| `street`       | String    | Obrigatório                                    |
| `number`       | String    | Obrigatório (string p/ aceitar "S/N", "123-A") |
| `complement`   | String?   | Opcional                                       |
| `neighborhood` | String    | Obrigatório                                    |
| `city`         | String    | Obrigatório                                    |
| `zipCode`      | String    | Obrigatório                                    |
| `createdAt`    | DateTime  | default `now()`                                |
| `orders`       | `Order[]` | Pedidos feitos por este cliente                |

---

## Regras de negócio

- **1 usuário = no máximo 1 cliente.** `userId` é único; tentar criar um segundo
  cadastro para o mesmo usuário cai em `P2002` → `409 Conflict`.
- **O cliente nunca informa o próprio `userId`.** Nas rotas `/me`, o `userId` vem
  sempre do JWT — o backend o injeta antes de salvar, ignorando o que vier no corpo.
- **Endereço é a fonte do "tem cadastro?".** No login (ver [auth.md](./auth.md)),
  a existência do `Client` decide se o usuário vai direto pro app ou para o
  `/onboarding`.
- A atualização (`PATCH`) altera apenas os campos de contato/endereço; `userId`
  e `id` são imutáveis.

---

## Endpoints

| Método   | Rota           | Papel      | Descrição                                        |
| -------- | -------------- | ---------- | ------------------------------------------------ |
| `GET`    | `/clients`     | `OPERATOR` | Lista todos os clientes                          |
| `POST`   | `/clients`     | `OPERATOR` | Cadastro manual (operador informa o `userId`)    |
| `GET`    | `/clients/:id` | `OPERATOR` | Busca por id                                     |
| `PATCH`  | `/clients/:id` | `OPERATOR` | Atualiza um cliente qualquer                     |
| `DELETE` | `/clients/:id` | `OPERATOR` | Remove um cliente                                |
| `POST`   | `/clients/me`  | `CLIENT`   | **Auto-cadastro** — `userId` vem do token        |
| `GET`    | `/clients/me`  | `CLIENT`   | Consulta o próprio cadastro (404 se não existir) |
| `PATCH`  | `/clients/me`  | `CLIENT`   | Atualiza o próprio cadastro (404 se não existir) |

### Diferença entre `POST /clients` e `POST /clients/me`

- **`/clients` (OPERATOR)** — o operador cria o cadastro de outra pessoa e
  precisa informar o `userId` no corpo.
- **`/clients/me` (CLIENT)** — o próprio usuário se cadastra; o `userId` do corpo
  é **sobrescrito** pelo do token antes de persistir.

> ⚠️ Hoje o `CreateClientDto` exige `userId` mesmo em `/clients/me`, onde ele será
> ignorado. Esse atrito de DTO está anotado no `TODO.md`.
