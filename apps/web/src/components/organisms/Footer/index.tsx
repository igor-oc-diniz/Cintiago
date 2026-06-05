import { Divider } from '@/components/atoms/Divider'

export function Footer() {
  return (
    <footer className="bg-[var(--color-surface-high)] border-t border-[var(--color-bamboo-accent)]">
      <Divider className="bamboo" />
      <div className="px-6 py-8 max-w-md mx-auto">
        <div className="mb-6">
          <p className="font-display font-bold text-xl text-[var(--color-primary)]">
            Cintiago
          </p>
          <p className="font-body italic text-sm text-[var(--color-on-surface-variant)] mt-1">
            Sabor artesanal, tradição italiana
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm font-body">
          <div>
            <p className="font-body font-semibold text-xs uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-2">
              Endereço
            </p>
            <p className="text-[var(--color-on-surface)]">
              Rua das Pizzas, 123
              <br />
              Bairro Italiano
              <br />
              São Paulo, SP
            </p>
          </div>
          <div>
            <p className="font-body font-semibold text-xs uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-2">
              Contato
            </p>
            <p className="text-[var(--color-on-surface)]">
              (11) 99999-0000
              <br />
              contato@cintiago.com.br
            </p>
          </div>
        </div>

        <p className="text-xs text-center text-[var(--color-outline)] pt-6 border-t border-[var(--color-bamboo-accent)] mt-6">
          © {new Date().getFullYear()} Cintiago. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
