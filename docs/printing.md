# Impressão de pedidos em impressora térmica (`backoffice`)

Spec de implementação da feature de **impressão de cupom** no painel do operador.

> **Decisão de arquitetura (travada):** a impressão é **responsabilidade do
> frontend**, via **USB** (Web Serial / WebUSB). O backend fica **fora** do caminho
> de impressão. **Rede (TCP 9100) está fora do MVP** — ver
> [§2 Por que rede ficou de fora](#2-por-que-rede-ficou-de-fora).

[↩ Plano do backoffice](./backoffice.md) · [Pedidos (API)](../api/docs/orders.md) · [Store (API)](../api/docs/store.md)

> Status: **spec** (pré-implementação). Premissas: backend em **nuvem**,
> impressora classe ESC/POS 58mm (ex.: JP58H), backoffice em **Chrome/Edge**.

---

## 1. Contexto e objetivo

Quando um pedido chega no backoffice (via WebSocket gateway já planejado), o
operador precisa de um **cupom físico** na cozinha/balcão. A impressora-alvo é uma
térmica genérica de 58mm classe **ESC/POS**.

**Objetivo:** dado um `Order`, gerar um cupom ESC/POS no browser e enviá-lo à
impressora **USB** ligada à estação do operador, acionado a partir da tela de
Pedidos.

### Objetivos

- Cupom legível (itens, metades, adicionais, borda, notas, total, entrega, troco).
- Impressão **100% no frontend**, sem backend no caminho.
- Transporte **USB** (Web Serial primário; WebUSB como alternativa).
- Acionamento a partir da tela de Pedidos (manual no MVP).
- Falha de impressão **nunca** perde o pedido (já persistido no backend).

### Não-objetivos (por ora)

- **Rede (TCP 9100)** — exige agente local na LAN (backend é nuvem). Fase futura.
- Bluetooth (Web Bluetooth) — a abstração deixa a porta aberta.
- Fila durável / retry persistente, relatórios, trilha de auditoria de impressão.

---

## 2. Por que rede ficou de fora

O browser **não consegue** imprimir via rede na LAN, mesmo a estação estando na
mesma rede que a impressora. Os bloqueios se somam:

| Bloqueio                     | Detalhe                                                                 |
| ---------------------------- | ----------------------------------------------------------------------- |
| Sem socket TCP cru           | `fetch`/`XHR` só fazem HTTP; `WebSocket` só ws/wss. Nada manda ESC/POS na 9100. |
| Impressora não fala HTTP     | `fetch` na 9100 → ela cospe cabeçalho HTTP como lixo e o request pendura. |
| Mixed content                | Backoffice HTTPS (nuvem) → `http://192.168.x.x` é bloqueado pelo Chrome. |
| Private Network Access       | Origem pública (domínio nuvem) → IP privado (`192.168.x.x`) é restrito.  |

> A *Direct Sockets API* (TCP no browser) existe, mas só pra **Isolated Web Apps**
> assinadas — não serve a uma web app deployada normal.

Como o **backend é nuvem**, ele também não alcança `192.168.x.x` da pizzaria. Logo,
**rede só volta com um agente local** rodando dentro da loja (§9 Futuro) — não no MVP.

> ✅ **USB escapa de tudo isso:** Web Serial/WebUSB **não são requests de rede**,
> são APIs de device com permissão do usuário. Funcionam a partir do HTTPS na nuvem,
> porque o browser fala direto com a porta física da estação.

---

## 3. Arquitetura: frontend-owned, USB

```
        ┌──────────────────────────────────────────────┐
        │              backoffice (browser)             │
        │                                                │
  Order ─►  buildOrderReceipt(order, store) ─► Uint8Array │
        │        (@cintiago/shared, roda no browser)      │
        │                      │                          │
        │                      ▼                          │
        │             PrinterTransport (USB)              │
        │           WebSerial  /  WebUSB                  │
        └──────────────────────┬─────────────────────────┘
                               ▼
                    impressora USB na estação
```

O backend **não participa** da impressão. Toda a cadeia — gerar bytes + enviar —
acontece no Chrome do operador.

> 🔑 O gerador `buildOrderReceipt` vive em **`packages/shared`** (já é isomórfico:
> `esc-pos-encoder` emite `Uint8Array` no browser). Fica no shared para reuso futuro
> pelo agente local de rede — mas, no MVP, só roda no front.

### Interface de transporte

```ts
export type PrinterTransportKind = "usb" | "network"; // network = futuro (agente)

export interface PrinterTransport {
  readonly kind: PrinterTransportKind;
  /** Conecta/solicita o device (exige gesto do usuário na 1ª vez). */
  connect(): Promise<void>;
  /** O device já foi concedido e está acessível? */
  isReady(): Promise<boolean>;
  /** Envia bytes ESC/POS prontos. Lança em falha de I/O. */
  send(data: Uint8Array): Promise<void>;
}
```

O hook `usePrinter()` consome a interface sem saber qual implementação está ativa —
hoje só existe `usb`, mas a forma já comporta o `network` do agente local.

---

## 4. Geração do cupom (ESC/POS)

### Onde vive

`packages/shared/src/printing/receipt.ts` →
`buildOrderReceipt(order, store): Uint8Array`.

Recebe o `Order` (mesma árvore que a API devolve) + dados de vitrine do `Store`
(nome, telefone). Retorna os bytes ESC/POS prontos. Função **pura** → testável sem
hardware.

### Esboço

```ts
import EscPosEncoder from "esc-pos-encoder";

export function buildOrderReceipt(order: Order, store: StoreInfo): Uint8Array {
  const enc = new EscPosEncoder().initialize().codepage("cp860"); // PT-BR

  enc.align("center").bold(true).line(store.name).bold(false)
     .line(store.phone)
     .line(LINE)                          // "--------------------------------" (32 col)
     .align("left")
     .bold(true).line(`PEDIDO #${order.id}`).bold(false)
     .line(formatDateTime(order.createdAt))
     .line(deliveryLabel(order.deliveryType))
     .line(LINE);

  for (const item of order.items) {
    enc.bold(true).line(itemHeadline(item)).bold(false);   // "1x Calabresa G"
    if (isHalfAndHalf(item)) enc.line(`  meia ${a} / meia ${b}`);
    for (const add of chargedAddons(item)) enc.line(`  + ${add.name}`);
    if (item.crustName) enc.line(`  borda: ${item.crustName}`);
    if (item.notes) enc.line(`  obs: ${item.notes}`);
    enc.line(rightAlign(item.name, money(item.lineTotal))); // preço à direita
  }

  enc.line(LINE)
     .line(rightAlign("Subtotal", money(order.subtotal)))
     .line(rightAlign("Entrega", money(order.deliveryFee)))
     .bold(true).line(rightAlign("TOTAL", money(order.total))).bold(false);

  if (order.changeFor) enc.line(rightAlign("Troco p/", money(order.changeFor)));
  if (order.estimatedDeliveryMinutes)
    enc.line(`ETA: ~${order.estimatedDeliveryMinutes} min`);

  return enc.newline().newline().newline().cut().encode();
}
```

### Regras de formatação (gotchas reais)

| Item        | Regra                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------- |
| **Acentos** | `codepage("cp860")` (português) ou `wpc1252`. **Sem isso, `ç/ã/é` saem embaralhados.** Validar na unidade. |
| **Largura** | 58mm = **32 colunas** (Font A). Alinhamento de preço respeita 32 chars. |
| **Corte**   | `.cut()` (`GS V`). **Inofensivo se a unidade não tem guilhotina** (a maioria dos JP58H baratos rasga na mão). |
| **Labels**  | Reaproveitar `SIZE_LABEL`, `DELIVERY_LABEL`, `pizzaItemLabel`, `money` centralizados (ver [strings-enums](../web/docs/strings-enums.md)). **Não** duplicar texto. |
| **Valores** | Backend é a fonte; o cupom só exibe `total/subtotal/deliveryFee` já calculados. |

### Teste de cupom (golden file)

Por ser pura, fixar a saída (`Uint8Array` → hex snapshot). Regressão de layout vira
diff de snapshot. **Independe de hardware** — destrava o resto do desenvolvimento.

---

## 5. Transporte USB (Web Serial / WebUSB)

### Qual API

> ⚠️ Muitos JP58H usam chip **CH340 → aparecem como USB-serial** → **Web Serial**.
> Modelos que se apresentam como classe USB "printer" → **WebUSB**.
> **Plano: Web Serial primeiro** (mais simples); WebUSB como alternativa.

Restrições (das duas APIs): **Chrome/Edge**, **HTTPS** (ou `localhost`), e **gesto
do usuário** pra conceder o device na 1ª vez. Depois,
`navigator.serial.getPorts()` / `navigator.usb.getDevices()` recuperam o device já
concedido — **a permissão fica salva pelo Chrome**, por origem.

### Esboço — Web Serial

```ts
class WebSerialTransport implements PrinterTransport {
  kind = "usb" as const;
  private port?: SerialPort;

  async connect() {                       // chamar a partir de um clique
    this.port = await navigator.serial.requestPort();
    await this.port.open({ baudRate: 9600 });
  }
  async isReady() {
    const [granted] = await navigator.serial.getPorts();
    return Boolean(this.port ?? granted);
  }
  async send(data: Uint8Array) {
    const port = this.port ?? (await navigator.serial.getPorts())[0];
    if (!port) throw new Error("no-device");
    if (!port.readable) await port.open({ baudRate: 9600 });
    const writer = port.writable!.getWriter();
    try { await writer.write(data); } finally { writer.releaseLock(); }
  }
}
```

> `baudRate` 9600 é o default típico desses clones; alguns usam 115200. Expor como
> preferência da estação se sair lixo / não imprimir.

---

## 6. Integração no backoffice

### Gatilho

A tela de **Pedidos** já recebe novos pedidos via WebSocket. No MVP o acionamento é
**manual**: botão **"Imprimir"** no card compacto e no drawer de detalhe.

### Hook `usePrinter()`

`hooks/usePrinter.ts` — encapsula transporte, estado e erros, no padrão dos demais
hooks, props tipadas, zero `any`.

```ts
type PrinterState = "unavailable" | "idle" | "printing" | "error";

export function usePrinter() {
  // resolve o WebSerialTransport; recupera device concedido via getPorts()
  // expõe: print(order), connect(), state, lastError
  async function print(order: Order) {
    const data = buildOrderReceipt(order, store);
    await transport.send(data);
  }
  return { print, connect, state, lastError };
}
```

### Componentes (Atomic Design)

| Nível    | Componente            | Papel                                                    |
| -------- | --------------------- | -------------------------------------------------------- |
| atom     | `PrinterStatusDot`    | bolinha verde/cinza/vermelha do estado da impressora     |
| molecule | `PrintButton`         | botão com loading/erro, usa `usePrinter().state`         |
| molecule | `PrinterSettingsForm` | "conectar impressora" + codepage/baudRate + flag auto    |

---

## 7. Configuração (por estação) e de-duplicação

### Onde guardar — `localStorage`

Com rede fora, **não há nada per-loja a salvar no `Store`**. A config é
**por estação**, em `localStorage`:

| Chave (`localStorage`) | Conteúdo                                  |
| ---------------------- | ----------------------------------------- |
| `printer.codepage`     | `"cp860"` (default)                       |
| `printer.baudRate`     | `9600` (default)                          |
| `printer.autoPrint`    | `false` (default)                         |

> O **device em si** não vai no `localStorage` — fica guardado pelo Chrome
> (`getPorts()`/`getDevices()` recuperam o grant entre sessões).

### Manual (MVP) vs automático (config)

| Modo          | Prós                                | Contras                                              |
| ------------- | ----------------------------------- | ---------------------------------------------------- |
| **Manual**    | previsível, sem impressão fantasma  | operador clica                                       |
| **Automático**| cozinha recebe sem ação             | risco de duplicar (reconnect do WS) / falha silenciosa |

> ✋ **MVP: manual**, com flag `autoPrint` desligada. Auto só depois, com de-dup sólido.

### De-duplicação (obrigatório mesmo no manual)

Reconnect do WebSocket re-emite pedido; duplo clique; auto-print. Guarda mínima:

- `Set<orderId>` de impressos na sessão (memória) → desabilita o botão / evita reenvio.
- Botão entra em `printing` e bloqueia reentrada.
- **Durável (futuro):** `Order.printedAt` no backend (encosta no audit trail deferido).

---

## 8. Falhas e edge cases

| Cenário                          | Comportamento esperado                                                  |
| -------------------------------- | ----------------------------------------------------------------------- |
| Sem permissão / device não concedido | `state = "unavailable"` + CTA "Conectar impressora" (gesto do usuário). |
| Device desplugado                | Re-prompt na próxima impressão. **Pedido permanece intacto.**           |
| Sem papel / tampa aberta         | Clones raramente reportam → erro genérico + retry manual.               |
| Browser sem Web Serial/WebUSB    | Detectar e avisar "use Chrome/Edge".                                    |
| Acentos embaralhados             | Ajustar codepage (`cp860`/`wpc1252`); fixar no golden test.             |
| Sem guilhotina                   | `.cut()` ignorado pela unidade; sem tratamento.                         |
| Duplo clique / WS reconnect      | De-dup (§7).                                                            |

---

## 9. Plano de implementação (faseado)

| Fase  | Entrega                                                                                     | Depende de        |
| ----- | ------------------------------------------------------------------------------------------- | ----------------- |
| **0** | **Smoke test** USB na unidade real: conectar via Web Serial num spike, mandar texto + confirmar codepage e se há guilhotina. | hardware          |
| **1** | `buildOrderReceipt` em `packages/shared` + **teste golden file**. *(sem hardware)*          | —                 |
| **2** | `WebSerialTransport` + `usePrinter()` + `PrintButton` no card/drawer de Pedidos.            | Fases 0–1, backoffice |
| **3** | `PrinterSettingsForm` (conectar device, codepage, baudRate) + de-dup + persistência localStorage. | Fase 2          |
| **4** | WebUSB como alternativa (se a unidade não for serial); flag `autoPrint`.                    | Fase 2            |

### Futuro (fora do MVP)

- **Agente local de rede:** processinho Node na LAN da pizzaria que recebe o pedido
  (WS/HTTP do backend nuvem) e abre o socket TCP 9100. Reaproveita
  `buildOrderReceipt` do shared. É o único caminho para **rede** com backend em nuvem.
- **Bluetooth** (Web Bluetooth) atrás da mesma interface.
- **`Order.printedAt` + log de impressão** (junto do audit trail deferido).
- **Reimpressão a partir do histórico**.

---

## Decisões — status

| # | Decisão                        | Status                                                              |
| - | ------------------------------ | ------------------------------------------------------------------ |
| 1 | Topologia do backend           | ✅ **Nuvem** → rede só via agente local (futuro).                  |
| 2 | Onde guardar config            | ✅ **`localStorage` por estação**; device no grant do Chrome.       |
| 3 | Transporte do MVP              | ✅ **USB** (Web Serial primário), frontend-owned.                  |
| 4 | Manual vs automático           | ✅ **Manual** no MVP; `autoPrint` como flag futura.                |
| 5 | Web Serial vs WebUSB           | ⏳ Depende da unidade (CH340 = serial). Confirmar no smoke test (Fase 0). |
