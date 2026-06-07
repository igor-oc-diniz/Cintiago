import { Button } from "@/components/atoms/Button";
import { Divider } from "@/components/atoms/Divider";
import { OptionCard } from "@/components/molecules/OptionCard";
import { CardHead } from "@/components/molecules/CardHead";
import { MetaRow } from "@/components/molecules/MetaRow";
import { AddressForm } from "@/components/molecules/AddressForm";
import {
  BikeIcon,
  StoreIcon,
  ClockIcon,
  TagIcon,
  PencilIcon,
  ChevronUpIcon,
  CheckIcon,
  ArrowLeftIcon,
} from "@/components/atoms/Icons";
import type { DeliverySelectionData } from "@/pages/SelectDelivery/useDeliverySelection";

export function DeliverySelectionMobile({
  sel,
  setSel,
  editing,
  toggleEditing,
  addr,
  onFieldChange,
  line1,
  line2,
  deliveryEta,
  deliveryFee,
  pizzeria,
  handleConfirm,
  handleBack,
}: DeliverySelectionData) {
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
            Entrega · 1 de 2
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
            Como você quer receber?
          </h1>
        </div>

        {/* Cards */}
        <div
          style={{
            padding: "16px 16px 0",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Delivery */}
          <OptionCard
            selected={sel === "delivery"}
            onClick={() => setSel("delivery")}
          >
            <div style={{ padding: 16 }}>
              <CardHead
                icon={<BikeIcon />}
                tone="terra"
                title="Delivery"
                sub="Levamos até você"
                on={sel === "delivery"}
              />

              <div style={{ marginTop: 13, paddingLeft: 2 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--fg4)",
                    marginBottom: 5,
                  }}
                >
                  Endereço cadastrado
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--fg1)",
                    lineHeight: 1.4,
                  }}
                >
                  {line1}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--fg3)",
                    marginTop: 1,
                  }}
                >
                  {line2}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSel("delivery");
                    toggleEditing();
                  }}
                  className="mt-[10px] !p-0 text-[var(--primary)] text-[13px]"
                >
                  {editing ? <ChevronUpIcon /> : <PencilIcon />}
                  {editing ? "Fechar edição" : "Editar endereço"}
                </Button>
              </div>

              {editing && (
                <AddressForm addr={addr} onFieldChange={onFieldChange} />
              )}

              <Divider className="my-[15px]" />
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <MetaRow
                  icon={<ClockIcon />}
                  label="Tempo estimado"
                  value={deliveryEta}
                />
                <MetaRow
                  icon={<TagIcon />}
                  label="Taxa de entrega"
                  value={deliveryFee}
                />
              </div>
            </div>
          </OptionCard>

          {/* Retirada no local */}
          <OptionCard
            selected={sel === "pickup"}
            onClick={() => setSel("pickup")}
          >
            <div style={{ padding: 16 }}>
              <CardHead
                icon={<StoreIcon />}
                tone="gold"
                title="Retirada no local"
                sub="Retire no balcão"
                on={sel === "pickup"}
              />

              <div style={{ marginTop: 13, paddingLeft: 2 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--fg4)",
                    marginBottom: 5,
                  }}
                >
                  Nosso endereço
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--fg1)",
                    lineHeight: 1.4,
                  }}
                >
                  {pizzeria.address}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--fg3)",
                    marginTop: 1,
                  }}
                >
                  {pizzeria.neighborhood}
                </div>
              </div>

              <Divider className="my-[15px]" />
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <MetaRow
                  icon={<ClockIcon />}
                  label="Pronto para retirada"
                  value={pizzeria.ready}
                />
                <MetaRow
                  icon={<TagIcon />}
                  label="Taxa de entrega"
                  value="Grátis"
                  accent
                />
              </div>
            </div>
          </OptionCard>
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
          className="h-[54px] rounded-[var(--radius-lg)] text-base shadow-[var(--shadow-md)]"
        >
          <CheckIcon color="var(--on-primary)" />
          Confirmar
        </Button>
      </div>
    </div>
  );
}
