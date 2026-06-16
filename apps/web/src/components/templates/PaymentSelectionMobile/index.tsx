import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { OptionCard } from "@/components/molecules/OptionCard";
import { CardHead } from "@/components/molecules/CardHead";
import {
  CreditCardIcon,
  ArrowLeftIcon,
  CheckIcon,
} from "@/components/atoms/Icons";
import type { PaymentSelectionData } from "@/pages/SelectPayment/usePaymentSelection";
import { PAYMENT_TYPE } from "@/constants/payment";
import type { Payment, PaymentType } from "@/types/domain";

function getPaymentIcon() {
  return <CreditCardIcon color="currentColor" />;
}

const PAYMENT_META: Record<
  PaymentType,
  { tone: "gold" | "terra" | "basil"; sub: string }
> = {
  CASH: { tone: "gold", sub: "Pagamento em espécie" },
  CREDIT: { tone: "terra", sub: "Crédito" },
  DEBIT: { tone: "basil", sub: "Débito" },
  PIX: { tone: "basil", sub: "Transferência instantânea" },
};

function getPaymentMeta(payment: Payment): {
  tone: "gold" | "terra" | "basil";
  sub: string;
} {
  return PAYMENT_META[payment.type] ?? { tone: "gold", sub: payment.name };
}

function isCash(payment: Payment): boolean {
  return payment.type === PAYMENT_TYPE.cash;
}

interface PaymentMethodCardProps {
  payment: Payment;
  selected: boolean;
  troco: string;
  total: number;
  onTroco: (value: string) => void;
  onSelect: (id: number, name: string, type: string) => void;
}

function PaymentMethodCard({
  payment,
  selected,
  troco,
  total,
  onTroco,
  onSelect,
}: PaymentMethodCardProps) {
  const { tone, sub } = getPaymentMeta(payment);
  const showTroco = selected && isCash(payment);

  const formattedTotal = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <OptionCard
      selected={selected}
      onClick={() => onSelect(payment.id, payment.name, payment.type)}
    >
      <div style={{ padding: 16 }}>
        <CardHead
          icon={getPaymentIcon()}
          tone={tone}
          title={payment.name}
          sub={sub}
          on={selected}
        />

        {showTroco && (
          <div
            style={{ marginTop: 14 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 10,
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-inset)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--fg3)",
                }}
              >
                Total do pedido
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--fg1)",
                }}
              >
                {formattedTotal}
              </span>
            </div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--fg4)",
                marginBottom: 6,
              }}
              htmlFor="troco-input"
            >
              Troco para quanto?
            </label>
            <input
              id="troco-input"
              type="text"
              inputMode="decimal"
              placeholder="R$ 0,00"
              value={troco}
              onChange={(e) => onTroco(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--border)",
                background: "var(--bg)",
                fontFamily: "var(--font-body)",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--fg1)",
                outline: "none",
                transition: "border-color var(--dur-fast) var(--ease-soft)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
              }}
            />
          </div>
        )}
      </div>
    </OptionCard>
  );
}

export function PaymentSelectionMobile({
  payments,
  isLoading,
  selectedId,
  troco,
  total,
  setTroco,
  handleSelect,
  handleConfirm,
  handleBack,
}: PaymentSelectionData) {
  return (
    <div
      style={{
        position: "relative",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      {/* Scroll area */}
      <div
        className="cg-noscroll"
        style={{ flex: 1, overflowY: "auto", paddingBottom: 120 }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            position: "sticky",
            top: 0,
            zIndex: 20,
            padding: "16px 16px 6px",
            background: "var(--bg)",
          }}
        >
          <Button
            variant="icon"
            onClick={handleBack}
            aria-label="Voltar"
            style={{ flexShrink: 0 }}
          >
            <ArrowLeftIcon />
          </Button>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 11.5,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--fg4)",
            }}
          >
            Pagamento · 2 de 2
          </span>
        </div>

        {/* Title */}
        <div style={{ padding: "6px 16px 2px" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 27,
              lineHeight: 1.12,
              letterSpacing: "-0.01em",
              color: "var(--fg1)",
              margin: 0,
            }}
          >
            Como vai pagar?
          </h1>
        </div>

        {/* Payment list */}
        <div
          style={{
            padding: "16px 16px 0",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "48px 0",
              }}
            >
              <Spinner size="lg" />
            </div>
          ) : (
            payments.map((payment) => (
              <PaymentMethodCard
                key={payment.id}
                payment={payment}
                selected={selectedId === payment.id}
                troco={troco}
                total={total}
                onTroco={setTroco}
                onSelect={handleSelect}
              />
            ))
          )}
        </div>
      </div>

      {/* Fixed footer */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 25,
          padding: "14px 16px 28px",
          background: "color-mix(in oklab, var(--parchment) 90%, transparent)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 -1px 0 var(--border)",
        }}
      >
        <Button
          fullWidth
          onClick={handleConfirm}
          disabled={selectedId === null}
          className="h-[54px] rounded-[var(--radius-lg)] text-base shadow-[var(--shadow-md)]"
        >
          <CheckIcon color="var(--on-primary)" />
          Confirmar
        </Button>
      </div>
    </div>
  );
}
