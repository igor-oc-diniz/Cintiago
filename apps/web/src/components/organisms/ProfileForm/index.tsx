import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { SearchIcon } from "@/components/atoms/Icons";
import type { ProfileFormProps } from "./types";

interface FieldProps {
  label: string;
  hint?: string;
  span?: boolean;
  children: React.ReactNode;
}

function Field({ label, hint, span, children }: FieldProps) {
  return (
    <label
      style={{
        display: "block",
        gridColumn: span ? "1 / -1" : undefined,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body, sans-serif)",
            fontWeight: 600,
            fontSize: 13,
            color: "var(--fg2, #3A2E24)",
          }}
        >
          {label}
        </span>
        {hint && (
          <span
            style={{
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: 12,
              color: "var(--fg4, #B0A090)",
            }}
          >
            · {hint}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}

export function ProfileForm({
  form,
  dirty,
  cepLoading,
  isSaving,
  onFieldChange,
  onZipChange,
  onSave,
}: ProfileFormProps) {
  return (
    <div className="cg-card cg-grain" style={{ padding: 24 }}>
      <div
        style={{
          fontFamily: "var(--font-display, serif)",
          fontWeight: 600,
          fontSize: 19,
          color: "var(--fg1, #1A1410)",
        }}
      >
        Dados de cadastro
      </div>
      <p
        style={{
          fontFamily: "var(--font-body, sans-serif)",
          fontSize: 13.5,
          color: "var(--fg3, #7A6A5A)",
          margin: "4px 0 0",
        }}
      >
        Usados para entrega e contato. Atualize quando precisar.
      </p>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--border, #E8E0D0)",
          margin: "18px 0 22px",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "18px 20px",
        }}
      >
        <Field label="Telefone" span>
          <Input
            type="tel"
            value={form.phone}
            onChange={(e) => onFieldChange("phone", e.target.value)}
            placeholder="(11) 90000-0000"
          />
        </Field>

        <Field label="CEP" hint="preenche o endereço">
          <div style={{ position: "relative" }}>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={9}
              value={form.zipCode}
              onChange={(e) => onZipChange(e.target.value)}
              placeholder="00000-000"
              style={{ paddingRight: 42 }}
            />
            <span
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                display: "flex",
              }}
            >
              <SearchIcon
                size={17}
                color={
                  cepLoading ? "var(--primary, #C0522A)" : "var(--fg4, #B0A090)"
                }
              />
            </span>
          </div>
        </Field>

        <Field label="Rua" hint="preenchido pelo CEP" span>
          <Input
            type="text"
            value={form.street}
            onChange={(e) => onFieldChange("street", e.target.value)}
          />
        </Field>

        <Field label="Número">
          <Input
            type="text"
            inputMode="numeric"
            value={form.number}
            onChange={(e) => onFieldChange("number", e.target.value)}
            placeholder="000"
          />
        </Field>

        <Field label="Complemento" hint="opcional" span>
          <Input
            type="text"
            value={form.complement}
            onChange={(e) => onFieldChange("complement", e.target.value)}
            placeholder="Apto, bloco…"
          />
        </Field>

        <Field label="Bairro" hint="pelo CEP">
          <Input
            type="text"
            value={form.neighborhood}
            onChange={(e) => onFieldChange("neighborhood", e.target.value)}
          />
        </Field>

        <Field label="Cidade" hint="pelo CEP">
          <Input
            type="text"
            value={form.city}
            onChange={(e) => onFieldChange("city", e.target.value)}
          />
        </Field>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 24,
        }}
      >
        <Button
          variant="primary"
          size="sm"
          disabled={!dirty || isSaving}
          onClick={onSave}
        >
          {isSaving ? "Salvando…" : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
}
