import { AppLayout } from '@/components/templates/AppLayout'
import { Footer }    from '@/components/organisms/Footer'
import { formatPrice } from '@/utils/format'
import type { PizzaDetailData } from './usePizzaDetailData'

const SIZE_LABELS: Record<string, string> = { small: 'Pequena', medium: 'Média', large: 'Grande' }
const SIZE_DESC:   Record<string, string> = { small: '4 fatias · 25cm', medium: '6 fatias · 30cm', large: '8 fatias · 35cm' }
const SIZE_ORDER = ['small', 'medium', 'large'] as const

function DSection({ title, required, note, children }: { title: string; required?: boolean; note?: string; children: React.ReactNode }) {
  return (
    <section style={{ paddingBottom: 26 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: 'var(--fg1)', margin: 0, whiteSpace: 'nowrap' }}>{title}</h3>
        {required && <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, color: 'var(--primary)', letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--primary-soft)', padding: '2px 8px', borderRadius: 999 }}>obrigatório</span>}
        {note && <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--fg4)', marginLeft: 'auto' }}>{note}</span>}
      </div>
      {children}
    </section>
  )
}

function Stepper({ value, onChange, min = 1 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <button type="button" disabled={value <= min} onClick={() => onChange(value - 1)} aria-label="Diminuir"
        style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border-strong)', background: 'var(--surface)', cursor: 'pointer', display: 'grid', placeItems: 'center', opacity: value <= min ? 0.4 : 1 }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 17, color: 'var(--fg1)', minWidth: 20, textAlign: 'center' }}>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Aumentar"
        style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border-strong)', background: 'var(--surface)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>
    </div>
  )
}

function IngredientChip({ name, removed, onToggle }: { name: string; removed: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: 'var(--radius-full)', cursor: 'pointer', background: removed ? 'var(--surface-inset)' : 'var(--surface)', boxShadow: removed ? 'inset 0 0 0 1px var(--border)' : 'inset 0 0 0 1px var(--border-strong)', border: 'none', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 13.5, color: removed ? 'var(--fg4)' : 'var(--fg2)', textDecoration: removed ? 'line-through' : 'none' }}>
      {removed
        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--fg4)" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>}
      {name}
    </button>
  )
}

function AddonRow({ name, price, active, onToggle }: { name: string; price: number; active: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '11px 13px', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: active ? 'var(--success-soft)' : 'var(--surface)', boxShadow: active ? 'inset 0 0 0 1.5px var(--success)' : 'inset 0 0 0 1px var(--border)', border: 'none', textAlign: 'left' }}>
      <span style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, display: 'grid', placeItems: 'center', background: active ? 'var(--success)' : 'transparent', boxShadow: active ? 'none' : 'inset 0 0 0 1.5px var(--border-strong)' }}>
        {active && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--parchment)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
      </span>
      <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, color: 'var(--fg1)' }}>{name}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: active ? 'var(--success-hover)' : 'var(--fg3)' }}>+ {formatPrice(price)}</span>
    </button>
  )
}

function HalfBlock({ label, pizzaName, defaultIngs, addonIngs, removedIds, addedIds, onRemove, onAdd }: {
  label?: string; pizzaName: string
  defaultIngs: { id: number; name: string; price: number }[]
  addonIngs:   { id: number; name: string; price: number }[]
  removedIds: number[]; addedIds: number[]
  onRemove: (id: number) => void; onAdd: (id: number) => void
}) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent-warm)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13.5, color: 'var(--fg1)' }}>{label}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--fg3)' }}>· {pizzaName}</span>
        </div>
      )}
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg4)', marginBottom: 9 }}>Vem com · toque p/ remover</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
        {defaultIngs.map((ing) => <IngredientChip key={ing.id} name={ing.name} removed={removedIds.includes(ing.id)} onToggle={() => onRemove(ing.id)} />)}
      </div>
      {addonIngs.length > 0 && (
        <>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg4)', marginBottom: 9 }}>Adicionar</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {addonIngs.map((ing) => <AddonRow key={ing.id} name={ing.name} price={ing.price} active={addedIds.includes(ing.id)} onToggle={() => onAdd(ing.id)} />)}
          </div>
        </>
      )}
    </div>
  )
}

export function PizzaDetailDesktop({
  pizza, crusts, allPizzas,
  selectedSize, setSelectedSize,
  selectedCrustId, setSelectedCrustId,
  qty, setQty,
  isMeia, secondPizzaId, setSecondPizzaId,
  removedIds, addedIds,
  secondPizza, basePrice, unitPrice, total,
  defaultIngs, addonIngs, secondDefaultIngs, secondAddonIngs,
  toggleRemoved, toggleAdded,
  enableMeia, disableMeia,
  handleAddToCart,
  navigate,
}: PizzaDetailData) {
  if (!pizza) return null

  const meia = isMeia && !!secondPizza

  return (
    <AppLayout variant="desktop" footer={<Footer />}>
      <div style={{ padding: '24px 0 96px' }}>
        {/* Back link */}
        <button type="button" onClick={() => navigate(-1)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--fg3)', padding: '4px 0', marginBottom: 18 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Voltar ao cardápio
        </button>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: 48, alignItems: 'start' }}>

          {/* LEFT — sticky image + info */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div className="cg-card" style={{ padding: 0, overflow: 'hidden' }}>
              {meia ? (
                <div style={{ position: 'relative', display: 'flex', height: 300 }}>
                  {pizza.imageUrl
                    ? <img src={pizza.imageUrl} alt={pizza.name} style={{ flex: 1, height: '100%', objectFit: 'cover' }} />
                    : <div style={{ flex: 1, height: '100%', background: 'radial-gradient(60% 60% at 38% 32%, #C97A45 0%, #9A4A22 55%, #5E2A12 100%)' }} />}
                  {secondPizza.imageUrl
                    ? <img src={secondPizza.imageUrl} alt={secondPizza.name} style={{ flex: 1, height: '100%', objectFit: 'cover' }} />
                    : <div style={{ flex: 1, height: '100%', background: 'radial-gradient(60% 60% at 62% 32%, #D9683F 0%, #A8331F 56%, #6E1E10 100%)' }} />}
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, transform: 'translateX(-1px)', background: 'rgba(253,249,239,0.5)' }} />
                  <div style={{ position: 'absolute', left: 14, bottom: 14, display: 'flex', gap: 6, alignItems: 'center', color: 'var(--parchment)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, background: 'rgba(38,30,20,0.4)', padding: '6px 12px', borderRadius: 999, backdropFilter: 'blur(4px)' }}>
                    Meia a meia
                  </div>
                </div>
              ) : (
                pizza.imageUrl
                  ? <img src={pizza.imageUrl} alt={pizza.name} style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }} />
                  : <div style={{ height: 340, background: 'radial-gradient(60% 60% at 38% 32%, #C97A45 0%, #9A4A22 55%, #5E2A12 100%)', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 30% 24%, rgba(255,246,230,0.32), transparent 60%)' }} />
                      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 -18px 32px rgba(60,30,12,0.28)' }} />
                    </div>
              )}
            </div>
            <div style={{ padding: '20px 4px 0' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, lineHeight: 1.12, letterSpacing: '-0.01em', color: 'var(--fg1)', margin: '0 0 8px' }}>
                {meia ? `${pizza.name} / ${secondPizza.name}` : pizza.name}
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.6, color: 'var(--fg3)', margin: 0 }}>
                {meia ? `Metade ${pizza.name}, metade ${secondPizza.name}. Personalize cada lado abaixo.` : pizza.description}
              </p>
            </div>
          </div>

          {/* RIGHT — configuration */}
          <div>
            {/* Tamanho */}
            <DSection title="Tamanho" required>
              <div style={{ display: 'flex', gap: 12 }}>
                {SIZE_ORDER.map((size) => {
                  const priceForSize = pizza.prices.find((p) => p.size === size)?.price
                  if (!priceForSize) return null
                  const computedBase = meia
                    ? Math.max(priceForSize, secondPizza.prices.find((p) => p.size === size)?.price ?? 0)
                    : priceForSize
                  const on = selectedSize === size
                  return (
                    <button key={size} type="button" onClick={() => setSelectedSize(size)}
                      style={{ flex: 1, padding: '16px 12px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', background: on ? 'var(--primary-soft)' : 'var(--surface)', boxShadow: on ? 'inset 0 0 0 2px var(--primary)' : 'inset 0 0 0 1px var(--border-strong)', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all var(--dur-fast) var(--ease-soft)' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: on ? 'var(--primary)' : 'var(--fg1)' }}>{SIZE_LABELS[size]}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'var(--fg4)' }}>{SIZE_DESC[size]}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--fg1)', marginTop: 3, whiteSpace: 'nowrap' }}>{formatPrice(computedBase)}</span>
                    </button>
                  )
                })}
              </div>
            </DSection>
            <hr className="cg-divider" style={{ marginBottom: 26 }} />

            {/* Borda */}
            {crusts.length > 0 && (
              <>
                <DSection title="Borda" note="opcional">
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {crusts.map((c) => {
                      const on = selectedCrustId === c.id
                      return (
                        <button key={c.id} type="button" onClick={() => setSelectedCrustId(on ? null : c.id)}
                          style={{ flexShrink: 0, minWidth: 120, padding: '12px 16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', background: on ? 'var(--primary-soft)' : 'var(--surface)', boxShadow: on ? 'inset 0 0 0 2px var(--primary)' : 'inset 0 0 0 1px var(--border-strong)', border: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14.5, color: on ? 'var(--primary)' : 'var(--fg1)' }}>{c.name}</span>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--fg3)' }}>{c.additionalPrice === 0 ? 'Grátis' : `+ ${formatPrice(c.additionalPrice)}`}</span>
                        </button>
                      )
                    })}
                  </div>
                </DSection>
                <hr className="cg-divider" style={{ marginBottom: 26 }} />
              </>
            )}

            {/* Meia a meia */}
            <DSection title="Meia a meia" note="opcional">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 'var(--radius-lg)', background: 'var(--surface)', boxShadow: 'inset 0 0 0 1px var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: 'var(--fg1)' }}>Quero dois sabores</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg3)' }}>
                    {meia ? `2ª metade: ${secondPizza.name}` : 'Escolha um segundo sabor — vale o preço do mais caro'}
                  </div>
                </div>
                <button type="button" role="switch" aria-checked={isMeia}
                  onClick={() => isMeia ? disableMeia() : enableMeia()}
                  style={{ width: 52, height: 31, borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0, position: 'relative', background: isMeia ? 'var(--success)' : 'var(--line-strong)', transition: 'background var(--dur-base) var(--ease-soft)' }}>
                  <span style={{ position: 'absolute', top: 3, left: isMeia ? 24 : 3, width: 25, height: 25, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-sm)', transition: 'left var(--dur-base) var(--ease-soft)' }} />
                </button>
              </div>

              {/* Inline second flavor picker — no sheet on desktop */}
              {isMeia && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 14 }}>
                  {allPizzas.filter((p) => p.id !== pizza.id).map((p) => {
                    const on = secondPizzaId === p.id
                    return (
                      <button key={p.id} type="button" onClick={() => setSecondPizzaId(p.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 11, padding: 10, borderRadius: 'var(--radius-lg)', cursor: 'pointer', background: on ? 'var(--primary-soft)' : 'var(--surface)', textAlign: 'left', boxShadow: on ? 'inset 0 0 0 1.5px var(--primary)' : 'inset 0 0 0 1px var(--border)', border: 'none' }}>
                        <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--oat)' }}>
                          {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: 'radial-gradient(60% 60% at 38% 32%, #C97A45 0%, #9A4A22 55%, #5E2A12 100%)' }} />}
                        </div>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15.5, color: 'var(--fg1)' }}>{p.name}</span>
                          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description}</span>
                        </span>
                        {on && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                      </button>
                    )
                  })}
                </div>
              )}
            </DSection>
            <hr className="cg-divider" style={{ marginBottom: 26 }} />

            {/* Personalizar */}
            <DSection title="Personalizar">
              {meia && (
                <div className="cg-note" style={{ marginBottom: 18 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold-800)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>Adicionais valem para a pizza inteira. O mesmo ingrediente nas duas metades é cobrado uma vez só.</span>
                </div>
              )}
              {meia ? (
                <div style={{ display: 'flex', gap: 28 }}>
                  <HalfBlock label="1ª metade" pizzaName={pizza.name} defaultIngs={defaultIngs} addonIngs={addonIngs} removedIds={removedIds[0]} addedIds={addedIds[0]} onRemove={(id) => toggleRemoved(0, id)} onAdd={(id) => toggleAdded(0, id)} />
                  <div style={{ width: 1, background: 'var(--border)', backgroundImage: 'repeating-linear-gradient(180deg, var(--border) 0 4px, transparent 4px 8px)', flexShrink: 0 }} />
                  <HalfBlock label="2ª metade" pizzaName={secondPizza.name} defaultIngs={secondDefaultIngs} addonIngs={secondAddonIngs} removedIds={removedIds[1]} addedIds={addedIds[1]} onRemove={(id) => toggleRemoved(1, id)} onAdd={(id) => toggleAdded(1, id)} />
                </div>
              ) : (
                <div style={{ maxWidth: 520 }}>
                  <HalfBlock pizzaName={pizza.name} defaultIngs={defaultIngs} addonIngs={addonIngs} removedIds={removedIds[0]} addedIds={addedIds[0]} onRemove={(id) => toggleRemoved(0, id)} onAdd={(id) => toggleAdded(0, id)} />
                </div>
              )}
            </DSection>
            <hr className="cg-divider" style={{ marginBottom: 26 }} />

            {/* Quantidade */}
            <DSection title="Quantidade">
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <Stepper value={qty} onChange={setQty} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--fg3)' }}>{qty > 1 ? `${qty} pizzas` : 'pizza'}</span>
              </div>
            </DSection>
          </div>
        </div>
      </div>

      {/* Sticky order bar */}
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40, background: 'color-mix(in oklab, var(--parchment) 92%, transparent)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', boxShadow: '0 -1px 0 var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 36px', height: 84, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--fg4)' }}>Total</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--fg1)', whiteSpace: 'nowrap' }}>{formatPrice(total)}</div>
          </div>
          <button type="button" onClick={handleAddToCart}
            style={{ minWidth: 280, height: 52, borderRadius: 'var(--radius-lg)', border: 'none', cursor: 'pointer', background: 'var(--primary)', color: 'var(--on-primary)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: 'var(--shadow-md)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
