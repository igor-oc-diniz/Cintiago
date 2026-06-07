import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { AddressForm } from "@/components/molecules/AddressForm";
import type { OnboardingTemplateProps } from "./types";

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest font-body text-[var(--color-on-surface-variant)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function OnboardingTemplate({
  userName,
  phone,
  onPhoneChange,
  addr,
  onAddrFieldChange,
  errors,
  isSubmitting,
  isCepLoading,
  isFormValid,
  onSubmit,
}: OnboardingTemplateProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-10 pb-6">
        <div className="mb-1">
          <span className="font-display font-bold text-2xl text-[var(--color-primary)]">
            Cintiago
          </span>
        </div>
        <h1 className="font-display font-semibold text-xl text-[var(--color-on-surface)] leading-snug">
          Olá, {userName}!
        </h1>
        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
          Precisamos de mais algumas informações para finalizar seu cadastro.
        </p>
      </header>

      {/* Form */}
      <main className="flex-1 px-6 flex flex-col gap-8 pb-32 max-w-lg w-full mx-auto">
        <FormSection title="Contato">
          <FormField label="Telefone" required error={errors.phone}>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="(00) 00000-0000"
              inputMode="tel"
              maxLength={15}
              error={errors.phone}
            />
          </FormField>
        </FormSection>

        <FormSection title="Endereço de entrega">
          <AddressForm
            addr={addr}
            onFieldChange={onAddrFieldChange}
            isCepLoading={isCepLoading}
          />
          {errors.cep && (
            <p className="text-xs text-[var(--color-error)]">{errors.cep}</p>
          )}
        </FormSection>
      </main>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-[var(--color-background)] border-t border-[var(--border)]">
        <div className="max-w-lg mx-auto">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={!isFormValid || isSubmitting}
            onClick={onSubmit}
            aria-label="Salvar cadastro e continuar"
          >
            Salvar e continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
