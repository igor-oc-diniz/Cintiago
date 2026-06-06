import { formatPrice } from '@/utils/format'
import type { PizzaDetailData } from './usePizzaDetailData'

const SIZE_LABELS: Record<string, string> = { small: 'Pequena', medium: 'Média', large: 'Grande' }
const SIZE_DESC:   Record<string, string> = { small: '4 fatias · 25cm', medium: '6 fatias · 30cm', large: '8 fatias · 35cm' }
const SIZE_ORDER = ['small', 'medium', 'large'] as const

function Section({ title, required, note, children }: { title: string; required?: boolean; note?: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginBottom: 11 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: 'var(--fg1)', margin: 0 }}>{title}</h3>
        {required && <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 10.5, color: 'var(--primary)', letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--primary-soft)', padding: '2px 8px', borderRadius: 999 }}>obrigatório</span>}
        {note && <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg4)', marginLeft: 'auto' }}>{note}</span>}
      </div>
      {children}
    </div>
  )
}

function Stepper({ value, onChange, min = 1 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <button type="button" disabled={value <= min} onClick={() => onChange(value - 1)} aria-label="Diminuir"
        style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border-strong)', background: 'var(--surface)', cursor: 'pointer', display: 'grid', placeItems: 'center', opacity: value <= min ? 0.4 : 1 }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: 'var(--fg1)', minWidth: 16, textAlign: 'center' }}>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Aumentar"
        style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border-strong)', background: 'var(--surface)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>
    </div>
  )
}

function IngredientChip({ name, removed, onToggle }: { name: string; removed: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 'var(--radius-full)', cursor: 'pointer', background: removed ? 'var(--surface-inset)' : 'var(--surface)', boxShadow: removed ? 'inset 0 0 0 1px var(--border)' : 'inset 0 0 0 1px var(--border-strong)', border: 'none', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 13, color: removed ? 'var(--fg4)' : 'var(--fg2)', textDecoration: removed ? 'line-through' : 'none' }}>
      {removed
        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--fg4)" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>}
      {name}
    </button>
  )
}

function AddonRow({ name, price, active, onToggle }: { name: string; price: number; active: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: active ? 'var(--success-soft)' : 'var(--surface)', boxShadow: active ? 'inset 0 0 0 1.5px var(--success)' : 'inset 0 0 0 1px var(--border)', border: 'none', textAlign: 'left' }}>
      <span style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, display: 'grid', placeItems: 'center', background: active ? 'var(--success)' : 'transparent', boxShadow: active ? 'none' : 'inset 0 0 0 1.5px var(--border-strong)' }}>
        {active && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--parchment)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
      </span>
      <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, color: 'var(--fg1)' }}>{name}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: active ? 'var(--success-hover)' : 'var(--fg3)' }}>+ {formatPrice(price)}</span>
    </button>
  )
}

export function PizzaDetailMobile({
  pizza, crusts, allIngredients, allPizzas,
  selectedSize, setSelectedSize,
  selectedCrustId, setSelectedCrustId,
  qty, setQty,
  isMeia, secondPizzaId, setSecondPizzaId,
  sheetOpen, setSheetOpen,
  removedIds, addedIds,
  secondPizza, basePrice, unitPrice, total,
  defaultIngs, addonIngs, secondDefaultIngs, secondAddonIngs,
  toggleRemoved, toggleAdded,
  enableMeia, disableMeia,
  handleAddToCart,
  navigate,
}: PizzaDetailData) {
  if (!pizza) return null

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="cg-noscroll" style={{ overflowY: 'auto', paddingBottom: 110 }}>

        {/* Full-bleed image */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', width: '100%', height: 232 }}>
            {pizza.imageUrl ? (
              <img src={pizza.imageUrl} alt={pizza.name} style={{ width: '100%', height: '100%', objectFit: 'cover', flex: 1 }} />
            ) : (
              <div style={{ flex: 1, height: '100%', background: 'radial-gradient(60% 60% at 38% 32%, #C97A45 0%, #9A4A22 55%, #5E2A12 100%)', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 30% 24%, rgba(255,246,230,0.32), transparent 60%)' }} />
                <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 -18px 32px rgba(60,30,12,0.28)' }} />
              </div>
            )}
            {isMeia && secondPizza && (
              <>
                {secondPizza.imageUrl ? (
                  <img src={secondPizza.imageUrl} alt={secondPizza.name} style={{ flex: 1, height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ flex: 1, height: '100%', background: 'radial-gradient(60% 60% at 62% 32%, #D9683F 0%, #A8331F 56%, #6E1E10 100%)' }} />
                )}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, transform: 'translateX(-1px)', background: 'rgba(253,249,239,0.5)' }} />
              </>
            )}
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(38,30,20,0.5), transparent 42%)' }} />
          <button type="button" onClick={() => navigate(-1)} aria-label="Voltar"
            style={{ position: 'absolute', top: 16, left: 14, width: 42, height: 42, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', background: 'color-mix(in oklab, var(--parchment) 82%, transparent)', backdropFilter: 'blur(8px)', boxShadow: 'var(--shadow-sm)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--fg1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          </button>
          {isMeia && (
            <div style={{ position: 'absolute', left: 16, bottom: 12, display: 'flex', gap: 6, alignItems: 'center', color: 'var(--parchment)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, background: 'rgba(38,30,20,0.34)', padding: '5px 11px', borderRadius: 999, backdropFilter: 'blur(4px)' }}>
              Meia a meia
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '18px 16px 16px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, lineHeight: 1.08, letterSpacing: '-0.01em', color: 'var(--fg1)', margin: '0 0 4px' }}>
            {isMeia && secondPizza ? `${pizza.name} / ${secondPizza.name}` : pizza.name}
          </h1>
          {!isMeia && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55, color: 'var(--fg3)', margin: 0 }}>{pizza.description}</p>
          )}
        </div>

        <hr className="cg-divider" style={{ margin: '0 16px' }} />

        {/* Size */}
        <div style={{ padding: '18px 0' }}>
          <Section title="Tamanho" required>
            <div style={{ display: 'flex', gap: 8 }}>
              {SIZE_ORDER.map((size) => {
                const priceForSize = pizza.prices.find((p) => p.size === size)?.price
                if (!priceForSize) return null
                const computedBase = isMeia && secondPizza
                  ? Math.max(priceForSize, secondPizza.prices.find((p) => p.size === size)?.price ?? 0)
                  : priceForSize
                const on = selectedSize === size
                return (
                  <button key={size} type="button" onClick={() => setSelectedSize(size)}
                    style={{ flex: 1, padding: '13px 8px 12px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', background: on ? 'var(--primary-soft)' : 'var(--surface)', boxShadow: on ? 'inset 0 0 0 2px var(--primary)' : 'inset 0 0 0 1px var(--border-strong)', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, transition: 'all var(--dur-fast) var(--ease-soft)' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14.5, color: on ? 'var(--primary)' : 'var(--fg1)' }}>{SIZE_LABELS[size]}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, color: 'var(--fg4)' }}>{SIZE_DESC[size]}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--fg1)', marginTop: 2, whiteSpace: 'nowrap' }}>{formatPrice(computedBase)}</span>
                  </button>
                )
              })}
            </div>
          </Section>
        </div>

        {/* Crust */}
        {crusts.length > 0 && (
          <>
            <hr className="cg-divider" style={{ margin: '0 16px' }} />
            <div style={{ padding: '18px 0' }}>
              <Section title="Borda" note="opcional">
                <div className="cg-noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px', margin: '0 -16px' }}>
                  {crusts.map((c) => {
                    const on = selectedCrustId === c.id
                    return (
                      <button key={c.id} type="button" onClick={() => setSelectedCrustId(on ? null : c.id)}
                        style={{ flexShrink: 0, minWidth: 104, padding: '10px 14px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', background: on ? 'var(--primary-soft)' : 'var(--surface)', boxShadow: on ? 'inset 0 0 0 2px var(--primary)' : 'inset 0 0 0 1px var(--border-strong)', border: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5, color: on ? 'var(--primary)' : 'var(--fg1)' }}>{c.name}</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg3)' }}>{c.additionalPrice === 0 ? 'Grátis' : `+ ${formatPrice(c.additionalPrice)}`}</span>
                      </button>
                    )
                  })}
                </div>
              </Section>
            </div>
          </>
        )}

        {/* Meia a meia */}
        <hr className="cg-divider" style={{ margin: '0 16px' }} />
        <div style={{ padding: '18px 0' }}>
          <Section title="Meia a meia" note="opcional">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--radius-lg)', background: 'var(--surface)', boxShadow: 'inset 0 0 0 1px var(--border)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--fg1)' }}>Quero meia a meia</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg3)' }}>{isMeia && secondPizza ? `2ª metade: ${secondPizza.name}` : 'Escolha um segundo sabor'}</div>
              </div>
              <button type="button" role="switch" aria-checked={isMeia} onClick={() => isMeia ? disableMeia() : enableMeia()}
                style={{ width: 50, height: 30, borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0, position: 'relative', background: isMeia ? 'var(--success)' : 'var(--line-strong)', transition: 'background var(--dur-base) var(--ease-soft)' }}>
                <span style={{ position: 'absolute', top: 3, left: isMeia ? 23 : 3, width: 24, height: 24, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-sm)', transition: 'left var(--dur-base) var(--ease-soft)' }} />
              </button>
            </div>
            {isMeia && (
              <button type="button" onClick={() => setSheetOpen(true)}
                style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'var(--primary)', padding: '2px 2px' }}>
                Trocar 2ª metade
              </button>
            )}
          </Section>
        </div>

        {/* Customization */}
        <hr className="cg-divider" style={{ margin: '0 16px' }} />
        <div style={{ padding: '18px 0' }}>
          <Section title="Personalizar">
            {isMeia && (
              <div className="cg-note" style={{ marginBottom: 14 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold-800)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Adicionais valem para a pizza inteira. O mesmo ingrediente nas duas metades é cobrado uma vez só.</span>
              </div>
            )}
            {isMeia && secondPizza ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <HalfBlock label="1ª metade" pizzaName={pizza.name} defaultIngs={defaultIngs} addonIngs={addonIngs} removedIds={removedIds[0]} addedIds={addedIds[0]} onRemove={(id) => toggleRemoved(0, id)} onAdd={(id) => toggleAdded(0, id)} />
                <hr className="cg-divider" />
                <HalfBlock label="2ª metade" pizzaName={secondPizza.name} defaultIngs={secondDefaultIngs} addonIngs={secondAddonIngs} removedIds={removedIds[1]} addedIds={addedIds[1]} onRemove={(id) => toggleRemoved(1, id)} onAdd={(id) => toggleAdded(1, id)} />
              </div>
            ) : (
              <HalfBlock pizzaName={pizza.name} defaultIngs={defaultIngs} addonIngs={addonIngs} removedIds={removedIds[0]} addedIds={addedIds[0]} onRemove={(id) => toggleRemoved(0, id)} onAdd={(id) => toggleAdded(0, id)} />
            )}
          </Section>
        </div>

        {/* Quantity */}
        <hr className="cg-divider" style={{ margin: '0 16px' }} />
        <div style={{ padding: '18px 0 8px' }}>
          <Section title="Quantidade">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 2px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--fg3)' }}>Quantas pizzas?</span>
              <Stepper value={qty} onChange={setQty} />
            </div>
          </Section>
        </div>
      </div>

      {/* Fixed footer */}
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 25, padding: '14px 16px 28px', background: 'color-mix(in oklab, var(--parchment) 90%, transparent)', backdropFilter: 'blur(14px)', boxShadow: '0 -1px 0 var(--border)' }}>
        <button type="button" onClick={handleAddToCart}
          style={{ width: '100%', height: 54, borderRadius: 'var(--radius-lg)', border: 'none', cursor: 'pointer', background: 'var(--primary)', color: 'var(--on-primary)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: 'var(--shadow-md)' }}>
          Adicionar ao carrinho
          <span style={{ opacity: 0.55, margin: '0 2px' }}>·</span>
          {formatPrice(total)}
        </button>
      </div>

      {/* Second flavor picker sheet */}
      {sheetOpen && (
        <div className="cg-scrim" onClick={() => setSheetOpen(false)}>
          <div className="cg-sheet" onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxHeight: 'min(74%, 560px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0 2px 12px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 21, color: 'var(--fg1)' }}>Segundo sabor</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg3)', marginTop: 2 }}>A metade atual continua sendo a 1ª.</div>
            </div>
            <div className="cg-noscroll" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 4 }}>
              {allPizzas.filter((p) => p.id !== pizza.id).map((p) => {
                const on = secondPizzaId === p.id
                return (
                  <button key={p.id} type="button" onClick={() => { setSecondPizzaId(p.id); setSheetOpen(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer', padding: 10, borderRadius: 'var(--radius-lg)', border: 'none', background: on ? 'var(--primary-soft)' : 'var(--surface)', boxShadow: on ? 'inset 0 0 0 1.5px var(--primary)' : 'inset 0 0 0 1px var(--border)' }}>
                    <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--oat)' }}>
                      {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: 'radial-gradient(60% 60% at 38% 32%, #C97A45 0%, #9A4A22 55%, #5E2A12 100%)' }} />}
                    </div>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--fg1)' }}>{p.name}</span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description}</span>
                    </span>
                    {on && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
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
    <div>
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-warm)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: 'var(--fg1)' }}>{label}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--fg3)' }}>· {pizzaName}</span>
        </div>
      )}
      {defaultIngs.length > 0 && (
        <>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg4)', marginBottom: 8 }}>Vem com · toque p/ remover</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
            {defaultIngs.map((ing) => <IngredientChip key={ing.id} name={ing.name} removed={removedIds.includes(ing.id)} onToggle={() => onRemove(ing.id)} />)}
          </div>
        </>
      )}
      {addonIngs.length > 0 && (
        <>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg4)', marginBottom: 8 }}>Adicionar</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {addonIngs.map((ing) => <AddonRow key={ing.id} name={ing.name} price={ing.price} active={addedIds.includes(ing.id)} onToggle={() => onAdd(ing.id)} />)}
          </div>
        </>
      )}
    </div>
  )
}
