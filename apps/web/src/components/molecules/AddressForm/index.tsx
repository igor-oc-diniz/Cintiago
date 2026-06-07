import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import type { AddressFormProps } from "./types";

export function AddressForm({
  addr,
  onFieldChange,
  isCepLoading = false,
}: AddressFormProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginTop: 14,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <FormField label="CEP">
        <Input
          value={addr.cep}
          onChange={(e) => onFieldChange("cep", e.target.value)}
          placeholder="00000-000"
          inputMode="numeric"
          maxLength={9}
        />
      </FormField>

      <FormField label="Rua">
        <Input
          value={isCepLoading ? "" : addr.rua}
          onChange={(e) => onFieldChange("rua", e.target.value)}
          placeholder={isCepLoading ? "Buscando…" : "Nome da rua"}
          disabled={isCepLoading}
        />
      </FormField>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 12 }}
      >
        <FormField label="Número">
          <Input
            value={addr.number}
            onChange={(e) => onFieldChange("number", e.target.value)}
            placeholder="000"
            inputMode="numeric"
          />
        </FormField>
        <FormField label="Complemento" hint="opcional">
          <Input
            value={addr.complement}
            onChange={(e) => onFieldChange("complement", e.target.value)}
            placeholder="Apto, bloco…"
          />
        </FormField>
      </div>

      <FormField label="Bairro">
        <Input
          value={isCepLoading ? "" : addr.neighborhood}
          onChange={(e) => onFieldChange("neighborhood", e.target.value)}
          placeholder={isCepLoading ? "Buscando…" : "Bairro"}
          disabled={isCepLoading}
        />
      </FormField>

      <FormField label="Cidade">
        <Input
          value={isCepLoading ? "" : addr.city}
          onChange={(e) => onFieldChange("city", e.target.value)}
          placeholder={isCepLoading ? "Buscando…" : "Cidade"}
          disabled={isCepLoading}
        />
      </FormField>
    </div>
  );
}
